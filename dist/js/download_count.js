"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function updateDownloadCount() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://crates.io/api/v1/crates/cgrustplot`);
            const data = yield response.json();
            let counter = document.getElementById("download-count");
            if (counter) {
                counter.textContent = data.crate.downloads;
            }
        }
        catch (error) {
            console.error("Error fetching download count:", error);
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    updateDownloadCount();
});
