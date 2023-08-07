import { useEffect, useRef } from "react";
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import { oktaConfig } from "../lib/oktaConfig";

const OktaSignInWidget = ({ onSuccess, onError }) => {
    // Okta SignIn widget'i için bir referans oluşturuyoruz
    const widgetRef = useRef();

    useEffect(() => {
        // Eğer widget referansı yoksa, işlemleri yapmadan çık
        if (!widgetRef.current) return false;

        // OktaSignIn nesnesini oluşturuyoruz ve yapılandırmayı sağladığımız oktaConfig objesini kullanıyoruz
        const widget = new OktaSignIn(oktaConfig);

        // SignIn Widget'i göstermek ve kimlik doğrulama tokenlarını almak için showSignInToGetTokens yöntemini çağırıyoruz
        widget.showSignInToGetTokens({
            el: widgetRef.current, // Widget'i oluşturmak için kullanacağımız DOM elementi
        })
            .then(onSuccess) // Kimlik doğrulama başarılı olursa onSuccess fonksiyonunu çağırırız
            .catch(onError); // Kimlik doğrulama hatalı olursa onError fonksiyonunu çağırırız

        // Komponent kaldırıldığında widget'i temizlemek için clean-up işlemini gerçekleştiriyoruz
        return () => widget.remove();
    }, [onSuccess, onError]);

    // Widget'i oluşturmak için kullanacağımız DOM elementini döndürüyoruz
    return (
        <div className="container mt-5 mb-5">
            <div ref={widgetRef}></div>
        </div>
        );
};

export default OktaSignInWidget;
