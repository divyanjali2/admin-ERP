export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/images/logo.webp"   
            alt="Application Logo"
            style={{
                height: "60px",
                objectFit: "cover",
            }}
        />
    );
}
