/** @type {import('next').NextConfig} */
const nextConfig = {
  env : {
    MONDODB_LOCAL_URI : "mongodb://localhost:27017/bookit",
    MONGODB_URI : "mongodb+srv://aribatise:oIKpFmxNa8SsVEVe@bookit.orcbyzk.mongodb.net/?retryWrites=true&w=majority&appName=BookIt",
    API_URL : "http://localhost:3000",
    NEXTAUTH_URL :  "http://localhost:3000",
    NEXTAUTH_SECRET : "hbsxsxtjsyxxhejid77472bbjx",

    STRPE_SECRET_KEY : "sk_test_51PqfiaGejk2a3EXyzyyDxntR1RDP0C4l2WhXcWbpge9INQHe9HwO7ajCqENpiIHv60VwrbLYs4kAKXGqFAkZ5VYD0024XDIOTA",
    STRIPE_WEBHOOK_SECRET : "whsec_8b71de9c73a127463b3df4cf1a5deb27b53a03a63a1bfad3803f9ee48d987ce4",

    CLOUDINARY_CLOUD_NAME : "deqswh7ps",
    CLOUDINARY_API_KEY : "999323214824544",
    CLOUDINARY_API_SECRET : "4IzipYD1Ox4In2FMVGwAgOEE_JI",
    CLOUDINARY_URL : "cloudinary://999323214824544:4IzipYD1Ox4In2FMVGwAgOEE_JI@deqswh7ps",

    SMTP_HOST: "sandbox.smtp.mailtrap.io",
    SMTP_PORT: 2525,
    SMTP_USER: "45a5f4d41afff0",
    SMTP_PASSWORD: "0acede37aa0000",
    SMTP_FROM_EMAIL : "noreply@bookit.com",
    SMTP_FROM_NAME : "BookIt",

    GEOCODER_API_KEY : "Jdnj4kw1lGrcWwiGLDo107C7COulGPb2",
    GEOCODER_PROVIDER : "mapquest"

  },
  images : {
    domains : ["res.cloudinary.com"]
  }
};

export default nextConfig;
