package com.example.springbootlibrary.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

import com.okta.spring.boot.oauth.Okta;

@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // Disable Cross Site Request Forgery (CSRF)
        http.csrf().disable();


        // Protect endpoints at (api/<type>/secure)
        http.authorizeRequests(configurer -> 
        configurer
            .antMatchers("/api/books/secure/**", "/api/reviews/secure/**","/api/messages/secure/**", "/api/admin/secure/**")
            .authenticated())
        .oauth2ResourceServer()
        .jwt();

        // Add CORS filter
        http.cors();

        //Add content negotiation strategy
        http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());


        //Force a non-emtpy response body for 401's to make the response more browser friendly
        Okta.configureResourceServer401ResponseBody(http);
                

        return http.build();
    };

}
