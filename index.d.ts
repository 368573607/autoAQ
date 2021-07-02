export as namespace autoAQ;
export = autoAQ;

interface User {
    name: string;
    pass: string;
    from: string;
}
declare function autoAQ(user: User, headless?: boolean, timeout?: number): void