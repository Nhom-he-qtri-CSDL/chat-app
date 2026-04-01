import "./App.css";
import { useCallback } from "react";

function App() {
  const login = useCallback(() => {
    if (
      !window.google ||
      !window.google.accounts ||
      !window.google.accounts.oauth2
    ) {
      console.error("Google API chưa sẵn sàng");
      return;
    }

    const oauth2 = window.google.accounts.oauth2;
    const init = oauth2.initCodeClient;
    if (typeof init !== "function") {
      console.error("initCodeClient không khả dụng");
      return;
    }

    const client = init({
      client_id:
        "12980680565-mvs1uv3vs8p01l3go3mkjii19juoahqc.apps.googleusercontent.com",
      scope:
        "openid email profile https://www.googleapis.com/auth/user.birthday.read",
      ux_mode: "popup",
      callback: (resp: { code?: string; error?: string }) => {
        console.log("CODE:", resp.code);

        fetch("https://localhost:443/api/v1/auth/google/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key":
              "7c771f67-f243-4166-a5f6-3b508799f70a_gG21JYbriiAcDbs4",
          },
          credentials: "include",
          body: JSON.stringify({
            auth_code: resp.code,
          }),
        })
          .then((res) => res.json())
          .then((data) => console.log(data))
          .catch((err) => console.error("Fetch error:", err));
      },
    });

    if (!client || typeof client.requestCode !== "function") {
      console.error("client.requestCode không khả dụng");
      return;
    }

    client.requestCode();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <button onClick={login}>Login with Google</button>
    </div>
  );
}
export default App;
