<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        body {
            font-family: 'Plus Jakarta Sans', Arial, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
            color: #1f2937;
        }
        .wrapper {
            width: 100%;
            background-color: #f3f4f6;
            padding: 40px 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05); /* Softer, deeper shadow */
            overflow: hidden;
            border: 1px solid #e5e7eb;
        }
        .header {
            padding: 40px 40px 20px;
            text-align: center;
            background: linear-gradient(to bottom, #ffffff, #f9fafb);
        }
        .logo {
            font-size: 28px;
            font-weight: 800;
            color: #4F46E5; /* Indigo-600 */
            text-decoration: none;
            letter-spacing: -0.5px;

            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: inline-block;
        }
        .content {
            padding: 0 40px 40px;
            color: #374151;
        }
        .greeting {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
            color: #111827;
        }
        .text {
            font-size: 16px;
            line-height: 1.6;
            color: #4B5563;
            margin-bottom: 24px;
        }
        .button-container {
            text-align: center;
            margin: 40px 0;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%); /* Gradient button */
            color: #ffffff !important; /* Force white text */
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            padding: 16px 48px; /* Slightly larger button */
            border-radius: 12px; /* More rounded */
            box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1);
            transition: all 0.3s ease;
        }
        .button:hover {
            transform: translateY(-1px);
            box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
        }
        .footer {
            padding: 32px 40px;
            background-color: #F9FAFB;
            text-align: center;
            font-size: 13px;
            color: #9CA3AF;
            border-top: 1px solid #f3f4f6;
        }
        .footer p {
            margin: 0;
            line-height: 1.5;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                border-radius: 0 !important;
                border: none;
            }
            .content {
                padding: 24px !important;
            }
            .header {
                padding: 32px 24px 16px;
            }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="header">
                 <img src="http://localhost:5173/login/Gemini_Generated_Image_8jllqr8jllqr8jll-removebg-preview.png" alt="TaskFlow Logo" width="60" style="display: block; margin: 0 auto; margin-bottom: 10px;">
                <a href="#" class="logo">TaskFlow</a>
            </div>
            <div class="content">
                <h1 class="greeting">Bonjour,</h1>
                <p class="text">
                    Nous avons reçu une demande de réinitialisation de votre mot de passe pour votre compte <strong>TaskFlow</strong>.
                </p>
                <p class="text">
                    Si vous êtes à l'origine de cette demande, vous pouvez réinitialiser votre mot de passe en cliquant sur le bouton ci-dessous :
                </p>
                
                <div class="button-container">
                    <!-- Updated Link with correct Frontend URL and query params -->
                    <a href="http://localhost:5173/reset-password?token={{ $token }}&email={{ $email }}" class="button">
                        Réinitialiser mon mot de passe
                    </a>
                </div>

                <p class="text" style="font-size: 14px; color: #6B7280;">
                    Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité. Votre mot de passe restera inchangé.
                </p>
                
                <div style="border-top: 1px solid #E5E7EB; margin-top: 32px; padding-top: 24px;">
                    <p class="text" style="margin-bottom: 0;">
                        Merci,<br>
                        <strong style="color: #111827;">L'équipe TaskFlow</strong>
                    </p>
                </div>
            </div>
            <div class="footer">
                <p>&copy; {{ date('Y') }} TaskFlow. Tous droits réservés.</p>
                <p style="margin-top: 8px;">Ceci est un email automatique, merci de ne pas y répondre.</p>
            </div>
        </div>
    </div>
</body>
</html>
