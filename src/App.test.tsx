import { render } from "@testing-library/react";
import App from "./App";

// App 컴포넌트가 정상적으로 렌더링되는지 확인
test("renders app without crashing", () => {
  render(<App />);
});
