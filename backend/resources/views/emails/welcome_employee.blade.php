<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenue chez growtrack</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            background-color: #f4f7fa;
            font-family: 'Outfit', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #1e293b;
        }
        
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
        }
        
        .header {
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
            padding: 60px 40px;
            text-align: center;
            color: white;
        }
        
        .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.02em;
        }
        
        .header p {
            margin-top: 10px;
            opacity: 0.9;
            font-size: 18px;
        }
        
        .content {
            padding: 40px;
            line-height: 1.6;
        }
        
        .content h2 {
            font-size: 24px;
            margin-top: 0;
            color: #0f172a;
        }
        
        .credentials-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            margin: 30px 0;
        }
        
        .credential-item {
            margin-bottom: 12px;
        }
        
        .credential-item:last-child {
            margin-bottom: 0;
        }
        
        .label {
            display: block;
            font-size: 12px;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 600;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
        }
        
        .value {
            font-size: 18px;
            font-weight: 600;
            color: #334155;
            font-family: 'Courier New', Courier, monospace;
        }
        
        .btn {
            display: inline-block;
            background: #6366f1;
            color: white !important;
            padding: 16px 32px;
            text-decoration: none;
            border-radius: 12px;
            font-weight: 600;
            margin-top: 20px;
            transition: transform 0.2s ease;
        }
        
        .footer {
            padding: 30px 40px;
            background: #f8fafc;
            text-align: center;
            font-size: 14px;
            color: #94a3b8;
        }
        
        .icon {
            font-size: 40px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon">🚀</div>
            <h1>Bienvenue chez growtrack !</h1>
            <p>Votre aventure commence ici.</p>
        </div>
        
        <div class="content">
            <h2>Bonjour {{ $user->first_name }},</h2>
            <p>Nous sommes ravis de vous accueillir dans l'équipe ! Votre compte a été configuré avec succès par l'administrateur.</p>
            <p>Vous pouvez maintenant accéder à votre espace de travail en utilisant les identifiants de connexion détaillés ci-dessous :</p>
            
            <div class="credentials-card">
                <div class="credential-item">
                    <span class="label">Adresse Email</span>
                    <span class="value">{{ $user->email }}</span>
                </div>
                <div class="credential-item">
                    <span class="label">Mot de passe temporaire</span>
                    <span class="value">{{ $password }}</span>
                </div>
            </div>
            
            <p>Pour des raisons de sécurité, nous vous recommandons vivement de modifier votre mot de passe lors de votre première connexion.</p>
            
            <a href="{{ config('app.frontend_url') ?? '#' }}" class="btn">Se connecter à growtrack</a>
        </div>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} growtrack. Tous droits réservés.</p>
            <p>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer cet email.</p>
        </div>
    </div>
</body>
</html>
