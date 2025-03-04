require("dotenv").config();
const he = require("he");
const { getLoginCookies } = require("../functions/getLoginCookies");

function decodeHTMLEntities(text) {
  return he.decode(text);
}

function limparHTML(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, "").trim();
}

class UsersController {
  static async fetchUsers(_req, res) {
    try {
      const cookie = await getLoginCookies();
      const member = process.env.MEMBER_ID_ZEUS;
      const baseUrl = process.env.URL_ZEUS;

      const myHeaders = new Headers();
      myHeaders.append(
        "accept",
        "application/json, text/javascript, */*; q=0.01"
      );
      myHeaders.append(
        "accept-language",
        "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,gl;q=0.6"
      );
      myHeaders.append("priority", "u=1, i");
      myHeaders.append("referer", `${baseUrl}/lines/manage`);
      myHeaders.append(
        "sec-ch-ua",
        '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"'
      );
      myHeaders.append("sec-ch-ua-mobile", "?0");
      myHeaders.append("sec-ch-ua-platform", '"Linux"');
      myHeaders.append("sec-fetch-dest", "empty");
      myHeaders.append("sec-fetch-mode", "cors");
      myHeaders.append("sec-fetch-site", "same-origin");
      myHeaders.append(
        "user-agent",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
      );
      myHeaders.append("x-requested-with", "XMLHttpRequest");
      myHeaders.append("Cookie", cookie);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      let page = 1;
      let cleanResults = [];
      let totalPages = 1;

      do {
        const url = `${baseUrl}/api/lines/${page}?username=&status=&others=&member_id=${member}&app_id=&reseller_notes=`;
        const response = await fetch(url, requestOptions);
        const result = await response.json();

        if (page === 1) {
          totalPages = result.pages;
        }

        cleanResults.push(
          ...result.results.map((item) => {
            const matchWhatsApp = item.message.match(
              /https:\/\/api.whatsapp.com\/send\?phone=\d+/
            );
            const whatsapp = matchWhatsApp ? matchWhatsApp[0] : null;
            const celular = whatsapp
              ? whatsapp.replace("https://api.whatsapp.com/send?phone=55", "")
              : null;
            const email =
              item.message.match(/mailto:[^"]+/)?.[0]?.replace("mailto:", "") ||
              null;

            return {
              id: item.id,
              username: item.username,
              status: limparHTML(item.status),
              exp_date: item.exp_date,
              max_connections: item.max_connections,
              reseller_notes: decodeHTMLEntities(item.reseller_notes)?.trim(),
              whatsapp,
              email,
              celular,
            };
          })
        );

        page++;
      } while (page <= totalPages);

      return res.json(cleanResults);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao buscar usuarios", details: error.message });
    }
  }

  static async renewalOfTrust(req, res) {
    try {
      const cookie = await getLoginCookies();
      const baseUrl = process.env.URL_ZEUS;
      const { id } = req.params;

      const myHeaders = new Headers();
      myHeaders.append(
        "accept",
        "application/json, text/javascript, */*; q=0.01"
      );
      myHeaders.append(
        "accept-language",
        "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,gl;q=0.6"
      );
      myHeaders.append(
        "content-type",
        "application/x-www-form-urlencoded; charset=UTF-8"
      );
      myHeaders.append("origin", `${baseUrl}`);
      myHeaders.append("priority", "u=1, i");
      myHeaders.append("referer", `${baseUrl}/lines/manage`);
      myHeaders.append(
        "sec-ch-ua",
        '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"'
      );
      myHeaders.append("sec-ch-ua-mobile", "?0");
      myHeaders.append("sec-ch-ua-platform", '"Linux"');
      myHeaders.append("sec-fetch-dest", "empty");
      myHeaders.append("sec-fetch-mode", "cors");
      myHeaders.append("sec-fetch-site", "same-origin");
      myHeaders.append(
        "user-agent",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
      );
      myHeaders.append("x-requested-with", "XMLHttpRequest");
      myHeaders.append("Cookie", cookie);

      const domain = baseUrl.replace("https://", "");
      const raw = `confirm=&method=post&action=https%3A%2F%2F${domain}%2Fapi%2Flines%2F${id}%2Ftrust-renew`;

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      // Aguarda a resposta do fetch
      const response = await fetch(
        `${baseUrl}/api/lines/${id}/trust-renew`,
        requestOptions
      );
      const result = await response.json();
      const returnDecode = decodeHTMLEntities(result.message);

      // Extrai apenas o conteúdo dentro da <div> usando regex
      const match = returnDecode.match(/<div[^>]*>(.*?)<\/div>/);
      const message = match ? match[1] : "Mensagem não encontrada";

      if (message !== "Renovação de confiança ativado") {
        return res.status(400).json({ success: false, message: message });
      }
      return res.json({ success: true, message });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao renovar confiança", details: error.message });
    }
  }

  static async renewal(req, res) {
    try {
      const cookie = await getLoginCookies();
      const baseUrl = process.env.URL_ZEUS;
      const { month = 1 } = req.body;
      const { id } = req.params;
      const monthRenew = (month * 1.216666667);

      const myHeaders = new Headers();
      myHeaders.append("Cookie", cookie);
      myHeaders.append("accept", "application/json, text/javascript, */*; q=0.01");
      myHeaders.append("accept-language", "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,gl;q=0.6");
      myHeaders.append("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
      myHeaders.append("origin", `${baseUrl}`);
      myHeaders.append("priority", "u=1, i");
      myHeaders.append("referer", `${baseUrl}/lines/manage`);
      myHeaders.append("sec-ch-ua", "\"Not(A:Brand\";v=\"99\", \"Google Chrome\";v=\"133\", \"Chromium\";v=\"133\"");
      myHeaders.append("sec-ch-ua-mobile", "?1");
      myHeaders.append("sec-ch-ua-platform", "\"Android\"");
      myHeaders.append("sec-fetch-dest", "empty");
      myHeaders.append("sec-fetch-mode", "cors");
      myHeaders.append("sec-fetch-site", "same-origin");
      myHeaders.append("user-agent", "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36");
      myHeaders.append("x-requested-with", "XMLHttpRequest");

      const raw = `package_id=1&remaining_months=${monthRenew}&original_max_connections=1&max_connections=1`;

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
      // Aguarda a resposta do fetch
      const response = await fetch(
        `${baseUrl}/api/lines/${id}/renew`,
        requestOptions
      );
      const result = await response.json();      
      const returnDecode = decodeHTMLEntities(result.message);
      
      // Extrai apenas o conteúdo dentro da <div> usando regex
      const match = returnDecode.match(/<div[^>]*>(.*?)<\/div>/);
      const message = match ? match[1] : "Mensagem não encontrada";

      if (message !== "Lista renovada com sucesso") {
        return res.status(400).json({ success: false, message: message });
      }
      return res.json({ success: true, message });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao renovar", details: error.message });
    }
  }
}

module.exports = UsersController;
