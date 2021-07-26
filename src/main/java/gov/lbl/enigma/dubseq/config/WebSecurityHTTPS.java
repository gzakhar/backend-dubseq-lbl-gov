//package gov.lbl.enigma.dubseq.config;
//
//import org.apache.catalina.Context;
//import org.apache.catalina.connector.Connector;
//import org.apache.tomcat.util.descriptor.web.SecurityCollection;
//import org.apache.tomcat.util.descriptor.web.SecurityConstraint;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
//import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.Customizer;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
//import org.springframework.security.config.web.server.ServerHttpSecurity;
//import org.springframework.security.web.server.SecurityWebFilterChain;
//
////@Configuration
//public class WebSecurityHTTPS extends WebSecurityConfigurerAdapter {
//
//    // IMPORTANT!!!
//    // If this parameter is empty then do not redirect HTTP to HTTPS
//    //
//    // Defined in application.properties file
//    @Value("${server.ssl.key-store:}")
//    private String sslKeyStore;
//
//    // Defined in application.properties file
//    // (User-defined Property)
//    @Value("${server.http.port:80}")
//    private int httpPort;
//
//    // Defined in application.properties file
//    @Value("${server.port:443}")
//    int httpsPort;
//
////    @Bean
////    SecurityWebFilterChain configure(ServerHttpSecurity http){
////
////        http.redirectToHttps(Customizer.withDefaults());
////
////        return http.build();
////    }
//
//    @Bean
//    public ServletWebServerFactory servletContainer() {
//        boolean needRedirectToHttps = sslKeyStore != null && !sslKeyStore.isEmpty();
//
//        TomcatServletWebServerFactory tomcat = null;
//
//        if (!needRedirectToHttps) {
//            tomcat = new TomcatServletWebServerFactory();
//            return tomcat;
//        }
//
//        tomcat = new TomcatServletWebServerFactory() {
//
//            @Override
//            protected void postProcessContext(Context context) {
//                SecurityConstraint securityConstraint = new SecurityConstraint();
//                securityConstraint.setUserConstraint("CONFIDENTIAL");
//                SecurityCollection collection = new SecurityCollection();
//                collection.addPattern("/*");
//                securityConstraint.addCollection(collection);
//                context.addConstraint(securityConstraint);
//            }
//        };
//        tomcat.addAdditionalTomcatConnectors(redirectConnector());
//        return tomcat;
//    }
//
//    private Connector redirectConnector() {
//        Connector connector = new Connector(TomcatServletWebServerFactory.DEFAULT_PROTOCOL);
//        connector.setScheme("http");
//        connector.setPort(httpPort);
//        connector.setSecure(false);
//        connector.setRedirectPort(httpsPort);
//        return connector;
//    }
//}
