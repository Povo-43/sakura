function invite(){
    const params = new URLSearchParams(window.location.search);
    const code = params.has("invite") && /^[A-Za-z0-9-]+$/.test(params.get("invite"))
        ? params.get("invite")
        : 'z7AmmNHvKR';

    window.open('https://discord.gg/' + code, '_blank');
}

//データ取得テスト
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("https://sites-backends.onrender.com/get?ch=bots");
    if (!res.ok) throw new Error("Fetch失敗: " + res.status);

    const data = await res.json();
    console.log("取得データ:", data);
  } catch (err) {
    console.error("エラー:", err);
  }
});