const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  // 서울시 공공데이터 프록시
  app.use(
    "/476466736a7061723432507868496c",
    createProxyMiddleware({
      target: "http://openapi.seoul.go.kr:8088",
      changeOrigin: true,
    }),
  );

  // 카카오 모빌리티 프록시
  app.use(
    "/kakao-navi",
    createProxyMiddleware({
      target: "https://apis-navi.kakaomobility.com",
      changeOrigin: true,
      pathRewrite: { "^/kakao-navi": "" },
    }),
  );
};
