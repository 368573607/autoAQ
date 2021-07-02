const { chromium } = require("playwright")

interface User {
    name: string;
    pass: string;
    from: string;
}

/**
 * 自动化安全平台
 * @param user 有三个参数，name是用户名，pass是密码，from是题目链接
 * @param headless 表示是否显示浏览器窗口，可省略，默认不显示
 * @param timeout 做题结束后等待的毫秒数，用于让用户确认做题无误
 */
const autoAQ = (user: User, headless: boolean = true, timeout: number = 0) => new Promise((resolve: Function, reject: Function) => {
    !(async () => {
        try {
            const browser = await chromium.launch({ headless })
            const context = await browser.newContext()
            const page = await context.newPage()

            //登录
            await page.goto("https://chengdu.xueanquan.com/")
            await page.fill("#UName", user.name)
            await page.fill("#PassWord", user.pass)
            await page.click("#LoginButton")
            await page.waitForURL("https://chengdu.xueanquan.com/MainPage.html")

            await page.goto(user.from)
            await page.evaluate(() => {
                ShowTestPaper()
                const select = new Map<number, number>()
                let error = new Set<number>()
                const questions = document.querySelector("#test_three").children
                let i: number = 1
                for (const question of questions) {
                    (<HTMLElement>question.querySelector(`div > dd:nth-child(1) > input`)).click()
                    select.set(i, 1)
                    i++
                }
                (<HTMLElement>document.querySelector("#input_button")).click()

                while ((<HTMLElement>document.querySelector("#no")).style.display !== "none") {
                    error = new Set()
                    i = 1
                    for (const question of questions) {
                        if ((<HTMLElement>question).style.display !== "none") {
                            error.add(i)
                        }
                        i++
                    }

                    reThreeShow()
                    i = 1
                    for (const question of questions) {
                        if (error.has(i)) {
                            select.set(i, select.get(i) + 1)
                                ; (<HTMLElement>question.querySelector(`div > dd:nth-child(${select.get(i)}) > input`)).click()
                        }
                        i++
                    }

                    (<HTMLElement>document.querySelector("#input_button")).click()
                }
            })

            await page.waitForTimeout(timeout) //便于观察
            await browser.close()
        } catch (e) {
            reject(e)
        }
        resolve()
    })()
})

module.exports = autoAQ
