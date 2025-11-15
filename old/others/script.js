//連携鯖一覧をservers.jsonから読み込む
document.addEventListener('DOMContentLoaded', loadfinish);
function loadfinish(){
    // 1秒後にフラグを立てる
    setTimeout(() => {
        timeoutComplete = true;
        if (loadComplete) {
            loaded();
        }
    }, 1300);

    fetch("./contact_servers/servers.json") // JSON を取得
    .then(response => response.json()) // JSON をオブジェクトに変換
    .then(data => {
        data.forEach(item => {
            item.server

            const container = document.getElementById("con_cards"); // 挿入する親要素

            container.innerHTML += `
                            <div class="con_card">
                    <div>
                        <h3 class="con_card_h3">${item.server}</h3>
                    </div>
                    <button onclick="con_detail(this);" class="con_card_btn" id="${item.name}">詳しく</button>
                </div>
            `;
        });
    })
    .catch(error => console.error("エラー:", error));

    
    // ページロード完了時
    window.onload = () => {
        loadComplete = true;
        if (timeoutComplete) {
            loaded();
        }
    };
}
function loaded(){
    document.getElementById("loading").style.opacity = "0";
    document.getElementById("loading").style.display = "none";
}

//document.getElementById("menu_button").addEventListener("mouseover", menu);
function menu(e){
    var menu_bg = document.getElementById("menu");
    var menu_close = document.getElementById("menu_blackout");
    var menu_button = document.getElementById("menu_button_img");

    if(e == "close"){
        menu_bg.classList.add("menu_show");
        menu_close.classList.add("menu_show_bg");
        menu_button.src = "./others/menu.svg";
    }

    if (menu_bg.classList.contains("menu_show")) {
        menu_bg.classList.remove("menu_show");
        menu_close.classList.remove("menu_show_bg");
        menu_button.src = "./others/menu.svg";
    } else {
        menu_bg.classList.add("menu_show");
        menu_close.classList.add("menu_show_bg");
        menu_button.src = "./others/close.svg";
    }
}

//連携鯖の詳細を取得
function con_detail(element){
    var contact_background = document.getElementById('contact_server_background');
    var contact_name = document.getElementById("contact_server_name");
    var contact_about = document.getElementById("contact_server_about");
    var contact_link = document.getElementById("contact_server_link");

    contact_background.style.display = "grid";
    var jsonname = "./contact_servers/jsons/" + element.id + ".json";
    fetch(jsonname) // JSON を取得
    .then(response => response.json()) // JSON をオブジェクトに変換
    .then(data => {
        contact_about.innerHTML = "";
            contact_name.textContent = data.name;
            data.description.forEach(item => {
            contact_about.insertAdjacentHTML("beforeend", marked.parse(item));
            });
            contact_link.href = data.join;
    })
    .catch(error => console.error("エラー:", error));

}

function server_more(){
    var contact_back = document.getElementById("contact_server_back_bg");
    var contact_info = document.getElementById("contact_server_info");
    var contact_about = document.getElementById("contact_server_about");
    var contact_more = document.getElementById("contact_server_more");
    var contact_btns = document.getElementById("contact_server_btns");

    contact_back.style.height = 0;
    contact_info.style.height = "calc(100vh - 70px)";
    contact_more.style.display = "none";
    contact_about.style.overflowY = "scroll";
    contact_btns.style.backgroundColor = "#fff";

}

//連携鯖の詳細を閉じる
function back(){
    var contact_detail = document.getElementById('contact_server_background');
    contact_detail.style.display = "none";
}
