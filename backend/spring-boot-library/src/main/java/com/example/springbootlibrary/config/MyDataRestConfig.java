package com.example.springbootlibrary.config;

import com.example.springbootlibrary.entity.*;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;


@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

        private String theAllowedOrigins = "https://localhost:3000";

        // configureRepositoryRestConfiguration methodu üzerinden Spring Data REST
        // yapılandırmasını yaparız.
        @Override
        public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

                // Bu dizide yer alan HTTP metodları, Book entity sınıfı için devre dışı
                // bırakılacaktır.
                HttpMethod[] theUnsupportedActions = {
                                HttpMethod.PUT,
                                HttpMethod.POST,
                                HttpMethod.DELETE,
                                HttpMethod.PATCH };

                // Book entity sınıfının ID alanını açığa çıkarır. Böylece istemciler ID'ye
                // erişebilir.
                config.exposeIdsFor(Book.class);
                config.exposeIdsFor(Review.class);
                config.exposeIdsFor(History.class);
                config.exposeIdsFor(Message.class);
                config.exposeIdsFor(Payment.class);

                // Book entity sınıfı için belirtilen HTTP metotlarını devre dışı bırakırız.
                disableHttpMethods(Book.class, config, theUnsupportedActions);
                disableHttpMethods(Review.class, config, theUnsupportedActions);
                disableHttpMethods(Message.class, config, theUnsupportedActions);
                disableHttpMethods(Payment.class, config, theUnsupportedActions);
                /* CORS Mapping yapılandırması */
                // CORS (Cross-Origin Resource Sharing) yapılandırması ekleyerek, istemci
                // tarafından farklı bir orijinden gelen istekleri kabul ederiz.
                // theAllowedOrigins değişkeni, izin verilen orijinleri içerir.
                cors.addMapping(config.getBasePath() + "/**").allowedOrigins(theAllowedOrigins);
        }

        // Verilen entity sınıfı için belirtilen HTTP metodlarını devre dışı bırakır.
        private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config,
                        HttpMethod[] theUnsupportedActions) {
                config.getExposureConfiguration()
                                .forDomainType(theClass)
                                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                                .withCollectionExposure(
                                                (metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
        }
}