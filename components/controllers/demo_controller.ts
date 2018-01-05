import * as express from "express";
import { IExcelManager } from "interfaces/managers";
import { Component, IConfig, ILogger, JsonObject } from "merapi";
import * as rp from "request-promise";

export default class DemoController extends Component {
    constructor(private logger: ILogger, private excelManager: IExcelManager, private config: IConfig) {
        super();
    }

    public async test(request: express.Request, response: express.Response) {
        const { body } = request;
        const { name, info } = body;
        this.excelManager.insertToSheet(name, info);
        response.status(200).json({ status: "ok" });
    }

    public async getUser(request: express.Request, response: express.Response) {
        const userId = request.params.userId;
        let res = await rp({
            method: "POST",
            uri: "https://slack.com/api/users.list?token=" + this.config.get("bot_token"),
        });
        let name;
        res = JSON.parse(res);
        for (let ii = 0; ii < res.members.length; ii++) {
            const user = res.members[ii];
            if (user.id === userId) {
                name = user.profile.real_name_normalized;
                break;
            }
        }
        response.status(200).json({ status: "ok", name });
    }
}

