"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const merapi_1 = require("merapi");
const google = require("googleapis");
const googleAuth = require("google-auth-library");
const sheets = google.sheets("v4");
class ExcelManager extends merapi_1.Component {
    constructor(logger, config) {
        super();
        this.logger = logger;
        this.config = config;
        const clientSecret = this.config.get("clientSecret");
        const clientId = this.config.get("clientId");
        const redirectUrl = this.config.get("redirectUrl");
        const token = {
            access_token: this.config.get("access_token"),
            expiry_date: this.config.get("expiry_date"),
            refresh_token: this.config.get("refresh_token"),
            token_type: this.config.get("token_type"),
        };
        const auth = new googleAuth();
        const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
        oauth2Client.credentials = token;
        this.oauth2Client = oauth2Client;
        this.spreadsheetId = this.config.get("spreadsheetId");
        this.templateSheetId = this.config.get("templateSheetId");
    }
    insertToSheet(name, info) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const monthFormatted = month < 10 ? "0" + month : month;
        const dayFormatted = day < 10 ? "0" + day : day;
        const sheetTitle = day + "-" + month + "-" + year;
        const spreadsheetId = this.spreadsheetId;
        const auth = this.oauth2Client;
        const sheetId = this.templateSheetId;
        const logger = this.logger;
        sheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: sheetTitle + "!A1:B",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [[name, info]],
            },
        }, function (err, result) {
            if (err) {
                sheets.spreadsheets.batchUpdate({
                    spreadsheetId,
                    resource: {
                        requests: [
                            {
                                duplicateSheet: {
                                    sourceSheetId: sheetId,
                                    insertSheetIndex: 0,
                                    newSheetName: sheetTitle,
                                },
                            },
                        ],
                    },
                    auth,
                }, function (err, response) {
                    if (response) {
                        sheets.spreadsheets.values.append({
                            auth,
                            spreadsheetId,
                            range: sheetTitle + "!A1:B",
                            valueInputOption: "USER_ENTERED",
                            resource: {
                                values: [[name, info]],
                            },
                        }, function (err, result) {
                            if (result) {
                                logger.info(`Success input ${name} to sheet`);
                            }
                        });
                    }
                });
            }
            if (result) {
                logger.info(`Success input ${name} to sheet`);
            }
        });
    }
}
exports.default = ExcelManager;
//# sourceMappingURL=excel_manager.js.map