"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const merapi_1 = require("merapi");
const rp = require("request-promise");
class DemoController extends merapi_1.Component {
    constructor(logger, excelManager, config) {
        super();
        this.logger = logger;
        this.excelManager = excelManager;
        this.config = config;
    }
    test(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = request;
            const { name, info } = body;
            this.excelManager.insertToSheet(name, info);
            response.status(200).json({ status: "ok" });
        });
    }
    getUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = request.params.userId;
            let res = yield rp({
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
        });
    }
}
exports.default = DemoController;
//# sourceMappingURL=demo_controller.js.map