package com.scrumflow.backend.config;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.scrumflow.backend.support.Input;

import jakarta.servlet.http.HttpServletRequest;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.json.JsonMapper;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final JsonMapper jsonMapper;
    private final AppProperties props;

    public WebConfig(JsonMapper jsonMapper, AppProperties props) {
        this.jsonMapper = jsonMapper;
        this.props = props;
    }

    /** Uploaded files (avatars) are served from /storage/..., like Laravel's public disk. */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = Path.of(props.storagePath()).toAbsolutePath().normalize().toUri().toString();
        registry.addResourceHandler("/storage/**").addResourceLocations(location.endsWith("/") ? location : location + "/");
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new InputResolver());
    }

    /**
     * Resolves {@link Input} controller parameters from a JSON body or, for form and multipart
     * requests, from the request parameters. A missing or malformed JSON body counts as empty input,
     * which then fails validation the same way it did in Laravel.
     */
    private final class InputResolver implements HandlerMethodArgumentResolver {

        @Override
        public boolean supportsParameter(MethodParameter parameter) {
            return parameter.getParameterType() == Input.class;
        }

        @Override
        public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                      NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws IOException {
            HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);
            Map<String, Object> data = new LinkedHashMap<>();
            String contentType = request.getContentType();
            if (contentType != null && contentType.toLowerCase().contains("json")) {
                try (InputStream in = request.getInputStream()) {
                    byte[] body = in.readAllBytes();
                    if (body.length > 0 && jsonMapper.readValue(body, Object.class) instanceof Map<?, ?> map) {
                        map.forEach((k, v) -> data.put(String.valueOf(k), v));
                    }
                } catch (JacksonException e) {
                    // malformed JSON: treated as an empty body
                }
            } else {
                request.getParameterMap().forEach((k, v) -> data.put(k, v.length == 1 ? v[0] : List.of(v)));
            }
            return new Input(data);
        }
    }
}
