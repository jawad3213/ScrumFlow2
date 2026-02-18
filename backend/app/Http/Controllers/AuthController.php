<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\RefreshToken;
use App\Mail\ResetPasswordMail;
use Laravel\Sanctum\PersonalAccessToken;
use Illuminate\Support\Facades\Cookie;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validation des données entrantes
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Tentative de connexion
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Identifiants invalides'
            ], 401);
        }

        // 3. Récupération de l'utilisateur directement depuis l'auth
        $user = Auth::user();

        // 4. Création des Tokens
        // Access Token: court terme (60 min)
        $accessToken = $user->createToken('access_token', ['*'], now()->addMinutes(60))->plainTextToken;
        
        // Refresh Token: dédié et séparé des tokens Sanctum
        $rawRefreshToken = Str::random(64);
        RefreshToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $rawRefreshToken),
            'expires_at' => now()->addDays(30),
        ]);

        // Création du cookie
        $refreshCookie = cookie(
            'refresh_token',
            $rawRefreshToken,
            60 * 24 * 30, // 30 jours
            '/',
            null,
            false,
            true,
            false,
            'Lax'
        );

        // 5. Retourner la réponse JSON avec le cookie
        return response()->json([
            'message' => 'Connexion réussie',
            'access_token' => $accessToken,
            'token_type' => 'Bearer',
            'user' => $user,
            'role' => $user->role,
        ])->withCookie($refreshCookie);
    }

    /**
     * Refresh the access token using a valid refresh token from cookie.
     */
    public function refreshToken(Request $request)
    {
        $rawToken = $request->cookie('refresh_token');

        \Log::info('[Auth] Refresh token request received', [
            'has_cookie' => !!$rawToken,
            'cookie_val_snippet' => $rawToken ? substr($rawToken, 0, 10) . '...' : 'NONE'
        ]);

        if (!$rawToken) {
            return response()->json(['message' => 'Token de rafraîchissement absent.'], 401);
        }

        $tokenRecord = RefreshToken::where('token', hash('sha256', $rawToken))->first();

        if (!$tokenRecord || $tokenRecord->isExpired()) {
            \Log::warning('[Auth] Refresh token invalid or expired');
            return response()->json(['message' => 'Token de rafraîchissement invalide ou expiré.'], 401);
        }

        \Log::info('[Auth] Token validated, rotating session for User: ' . $tokenRecord->user_id);

        $user = $tokenRecord->user;

        // Rotation du refresh token
        $tokenRecord->delete();
        $newRawRefreshToken = Str::random(64);
        RefreshToken::create([
            'user_id' => $user->id,
            'token' => hash('sha256', $newRawRefreshToken),
            'expires_at' => now()->addDays(30),
        ]);

        $newAccessToken = $user->createToken('access_token', ['*'], now()->addMinutes(60))->plainTextToken;

        $refreshCookie = cookie(
            'refresh_token',
            $newRawRefreshToken,
            60 * 24 * 30, // 30 jours
            '/',
            null,
            false,
            true,
            false,
            'Lax'
        );

        return response()->json([
            'access_token' => $newAccessToken,
            'token_type' => 'Bearer',
        ])->withCookie($refreshCookie);
    }
    
    // Optionnel : Logout
    public function logout(Request $request)
    {
        $user = $request->user();
        
        // Supprimer le token d'accès actuel
        // Only delete if it's a real PersonalAccessToken (not a TransientToken)
        $token = $user->currentAccessToken();
        if ($token instanceof \Laravel\Sanctum\PersonalAccessToken) {
            $token->delete();
        }

        // Supprimer le refresh token de la DB s'il existe dans le cookie
        $rawToken = $request->cookie('refresh_token');
        if ($rawToken) {
            RefreshToken::where('token', hash('sha256', $rawToken))->delete();
        }

        // Supprimer le cookie
        $forgetCookie = cookie()->forget('refresh_token');

        return response()->json(['message' => 'Déconnexion réussie'])->withCookie($forgetCookie);
    }

    // 1. Demande de réinitialisation de mot de passe
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Email non trouvé.'], 404);
        }

        // Générer un token
        $token = Str::random(60);

        // Stocker le token dans la base de données
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => $token, // Idéalement hasher le token, mais pour simplicité ici stocké tel quel ou comme demandé par l'utilisateur
                'created_at' => now(),
            ]
        );

        // Envoyer l'email
        try {
            Mail::to($request->email)->send(new ResetPasswordMail($token, $request->email));
        } catch (\Exception $e) {
             return response()->json(['message' => 'Erreur lors de l\'envoi de l\'email.'], 500);
        }

        return response()->json(['message' => 'Email de réinitialisation envoyé.']);
    }

    // 2. validation du token et changement du mot de passe
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required',
            'password' => 'required|min:6|confirmed', // confirmed cherche un champ password_confirmation
        ]);

        // Vérifier le token
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$resetRecord) {
             return response()->json(['message' => 'Token invalide ou email incorrect.'], 400);
        }

        // Mettre à jour le mot de passe de l'utilisateur
        $user = User::where('email', $request->email)->first();
        if (!$user) {
             return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        // Supprimer le token utilisé
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès.']);
    }
}

