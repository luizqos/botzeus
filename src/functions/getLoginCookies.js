require("dotenv").config();
const puppeteer = require("puppeteer");

async function getLoginCookies() {
  const browser = await puppeteer.launch({
    headless: Boolean(parseInt(process.env.HEADLESS)),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-software-rasterizer",
      "--disable-features=VizDisplayCompositor",
      "--disable-features=site-per-process"
    ],
    executablePath: process.env.DIRECTORY_BROWSER,
  });
  const page = await browser.newPage();
  const timeBrowser = process.env.TIME_BROWSER;

  try {
    // Acessa a página de login
    await page.goto(process.env.URL_ZEUS + "/login", {
      waitUntil: "networkidle2",
    });

    // Preenche os campos de login usando variáveis de ambiente
    await page.type('input[name="username"]', process.env.LOGIN_USER_ZEUS);
    await page.type('input[name="password"]', process.env.LOGIN_PASSWORD_ZEUS);

    // Clica no botão de login e espera o redirecionamento
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2" }),
      page.click('button[type="submit"]'),
    ]);

    // Obtém os cookies após o login
    const cookies = await page.cookies();
    const currentCookie = `PHPSESSID=${cookies[0].value}`;

    // Agendar fechamento do navegador sem bloquear a execução
    console.log(
      `Navegador permanecerá aberto por ${
        parseInt(timeBrowser) / 60000
      } minuto(s)...`
    );
    setTimeout(async () => {
      console.log("Fechando navegador...");
      await browser.close();
    }, timeBrowser);

    return currentCookie; // Retorna o cookie imediatamente
  } catch (error) {
    console.error("Erro ao obter cookies:", error);
    return null;
  }
}

module.exports = { getLoginCookies };
