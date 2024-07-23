package com.findmrotue.fmr.config;

import org.springframework.context.MessageSource;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public class CustomMessageSource {

    private final MessageSource messageSource;

    public CustomMessageSource() {
        ReloadableResourceBundleMessageSource messageSource
                = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames("classpath:messages");
        messageSource.setDefaultEncoding("UTF-8");
        messageSource.setCacheSeconds(5);
        this.messageSource = messageSource;
    }

    public String get(String code) {
        return messageSource.getMessage(code, null, Locale.ENGLISH);
    }

    public String get(String code, Object... objects) {
        return messageSource.getMessage(code, objects, Locale.ENGLISH);
    }
}
