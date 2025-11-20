document.addEventListener("DOMContentLoaded", async () => {
    let finalCode = "z7AmmNHvKR"; // デフォルト
    const allowedGuildId = "1208962938388484107";
    const overlay = document.getElementById("overlay");

    // --- ページロード時に invite 検証 ---
    async function initInvite() {
        const params = new URLSearchParams(window.location.search);
        const rawCode = params.get("invite");

        if (!rawCode || !/^[A-Za-z0-9-]+$/.test(rawCode)) return;

        try {
            const res = await fetch(`https://bot.sakurahp.f5.si/api/invites/${rawCode}`);
            if (!res.ok) return;

            const data = await res.json();
            if (data.match === true && data.invite.guild?.id === allowedGuildId) {
                finalCode = rawCode; // 有効なら変数に保持
                console.log("招待コード検証OK:", finalCode);
            } else {
                console.log("招待コード無効または許可されていないサーバー");
            }
        } catch (err) {
            console.error("招待コード検証エラー:", err);
        }
    }

    await initInvite(); // ページロード時に検証

    // --- ボタン処理 ---
    const buttons = document.querySelectorAll(".join_button");
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            console.log("ボタン押された", finalCode);
            overlay.style.display = "flex";

            window.open(`https://discord.gg/${finalCode}`, "_blank");
            setTimeout(() => overlay.style.display = "none", 1000);
        });
    });

    // --- お知らせ取得 ---
    try {
        const res = await fetch("https://api.kotoca.net/get?ch=announce");
        if (!res.ok) throw new Error("Fetch失敗: " + res.status);

        const data = await res.json();
        console.log(data);
        const box = document.getElementById("news_box");
        box.textContent = "";

        data.forEach((entry, index) => {
            const date = new Date(entry.createdAt).toLocaleString();

            const lines = entry.content.split('\n');
            let titleLineIndex = lines.findIndex(line => line.startsWith('# '));
            if (titleLineIndex === -1) titleLineIndex = 0;
            const title = lines[titleLineIndex].replace(/^#\s*/, '');
            const bodyLines = lines.slice(titleLineIndex + 1);
            const body = bodyLines.join('\n');

            const pDate = document.createElement("p");
            pDate.textContent = date;

            const h3 = document.createElement("h3");
            h3.textContent = title;
            h3.style.cursor = "pointer";

            
      const divBody = document.createElement("div");
            divBody.textContent = body;
            divBody.style.boxShadow = "none";
            divBody.style.border = "none";
            divBody.style.display = "none";
            divBody.style.whiteSpace = "pre-wrap";

            h3.addEventListener("click", () => {
                divBody.style.display = divBody.style.display === "none" ? "block" : "none";
            });

            box.appendChild(pDate);
            box.appendChild(h3);
            box.appendChild(divBody);

            if (index !== data.length - 1) {
                const hr = document.createElement("hr");
                box.appendChild(hr);
            }
        });

    } catch (err) {
        console.error("お知らせ読み込みでエラー:", err);
    }

    // --- サーバー情報取得 ---
    try {
        const res = await fetch("https://bot.sakurahp.f5.si/api");
        if (!res.ok) throw new Error("Fetch失敗: " + res.status);

        const data = await res.json();
        console.log(data);

        const memberSpan = document.getElementById("member-count");
        const onlineSpan = document.getElementById("online-count");
        const vcSpan = document.getElementById("vc-count");
        const timestampSpan = document.getElementById("server_info_timestamp");

        if (memberSpan) memberSpan.textContent = data.guild.member ?? "取得不可";
        if (onlineSpan) onlineSpan.textContent = data.guild.online ?? "取得不可";
        if (vcSpan) vcSpan.textContent = data.guild.voice ?? "取得不可";
        if (timestampSpan) timestampSpan.textContent = data.timestamp ?? "エラーにより取得できませんでした";

    } catch (err) {
        console.error("サーバー情報読み込みでエラー:", err);

        const memberSpan = document.getElementById("member-count");
        const onlineSpan = document.getElementById("online-count");
        const vcSpan = document.getElementById("vc-count");

        if (memberSpan) memberSpan.textContent = "エラー";
        if (onlineSpan) onlineSpan.textContent = "エラー";
        if (vcSpan) vcSpan.textContent = "エラー";
    }

    // bot一覧取得
    try {
        const res = await fetch("https://api.kotoca.net/get?ch=bots");
        if (!res.ok) throw new Error("Fetch失敗: " + res.status);

        const data = await res.json();
        console.log(data);

        const ul = document.getElementById("bots_ul");
        const othersLi = document.getElementById("bots_others");
        if (othersLi) othersLi.remove();

        data.forEach(entry => {
            const lines = entry.content.split('\n');
            const botName = lines[0] || "名前不明";
            const description = lines.slice(1).join('\n') || "";

            const li = document.createElement("li");

            // h3 と img をまとめる div
            const topDiv = document.createElement("div");
            topDiv.style.display = "grid";
            topDiv.style.gridTemplateColumns = "50px 1fr";
            topDiv.style.gridTemplateRows = "1fr";

            // 添付画像がある場合のみ
            if (entry.attach && entry.attach.length > 0) {
                const img = document.createElement("img");
                img.src = entry.attach[0];
                img.alt = botName;
                img.style.width = "50px";
                img.style.border = "solid #e099ae 4px";
                topDiv.appendChild(img);
            }

            const h3 = document.createElement("h3");
            h3.textContent = botName;
            h3.style.margin = "auto 0 auto 20px";
            h3.style.display = "inline";
            topDiv.appendChild(h3);

            li.appendChild(topDiv);

            const p = document.createElement("p");
            p.textContent = description;
            li.appendChild(p);

            ul.appendChild(li);
        });

    } catch (err) {
        console.error("Bot一覧取得エラー:", err);
    }
});
