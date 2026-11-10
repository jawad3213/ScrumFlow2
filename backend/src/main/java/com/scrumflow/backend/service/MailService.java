package com.scrumflow.backend.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Year;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.scrumflow.backend.config.AppProperties;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

/**
 * Transactional e-mail. MAIL_MAILER=log (the default, as in Laravel) writes the message to the
 * application log; MAIL_MAILER=smtp sends it through MAIL_HOST / MAIL_PORT.
 */
@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final AppProperties props;
    private final TemplateEngine templates;

    public MailService(AppProperties props, TemplateEngine templates) {
        this.props = props;
        this.templates = templates;
    }

    public void sendPasswordReset(String email, String token) throws MessagingException {
        String frontend = props.frontendUrl().replaceAll("/+$", "");
        Context ctx = new Context();
        ctx.setVariable("frontendUrl", frontend);
        ctx.setVariable("resetUrl", frontend + "/reset-password?token=" + encode(token) + "&email=" + encode(email));
        ctx.setVariable("year", Year.now().getValue());
        send(email, "Réinitialisation de mot de passe", templates.process("emails/reset_password", ctx));
    }

    private void send(String to, String subject, String html) throws MessagingException {
        AppProperties.Mail mail = props.mail();
        String mailer = AppProperties.clean(mail.mailer());
        if (mailer == null || mailer.equalsIgnoreCase("log")) {
            log.info("[Mail] To: {} | Subject: {}\n{}", to, subject, html);
            return;
        }
        JavaMailSenderImpl sender = sender(mail);
        MimeMessage message = sender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
        String fromName = AppProperties.clean(mail.fromName());
        try {
            if (fromName != null) {
                helper.setFrom(mail.fromAddress(), fromName);
            } else {
                helper.setFrom(mail.fromAddress());
            }
        } catch (java.io.UnsupportedEncodingException e) {
            helper.setFrom(mail.fromAddress());
        }
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(html, true);
        sender.send(message);
    }

    private static JavaMailSenderImpl sender(AppProperties.Mail mail) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        sender.setHost(AppProperties.clean(mail.host()));
        if (mail.port() != null) {
            sender.setPort(mail.port());
        }
        String username = AppProperties.clean(mail.username());
        Properties p = sender.getJavaMailProperties();
        if (username != null) {
            sender.setUsername(username);
            sender.setPassword(AppProperties.clean(mail.password()));
            p.put("mail.smtp.auth", "true");
        }
        if ("smtps".equalsIgnoreCase(AppProperties.clean(mail.scheme()))) {
            sender.setProtocol("smtps");
        } else {
            p.put("mail.smtp.starttls.enable", "true");
        }
        p.put("mail.smtp.connectiontimeout", "10000");
        p.put("mail.smtp.timeout", "10000");
        return sender;
    }

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
