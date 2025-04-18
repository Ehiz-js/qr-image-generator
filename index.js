//IMPORT PACKAGES
import express from "express";
import qr from "qr-image";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

//GLOBAL VARIABLES
const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
let userInput;

//MIDDLEWARE
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

//ROUTES
//display main page
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

//get user input
app.post("/submit", (req, res) => {
	userInput = req.body.website;
	//console.log for testing
	console.log(userInput);
	//GENERATE AND SAVE QR IMAGE
	let qr_img = qr.image(`https://${userInput}.com`, { type: "png" });
	qr_img.pipe(
		fs.createWriteStream(path.join(__dirname, "public", "qr_img.png"))
	);
	//go to next page
	qr_img.on("end", () => {
		res.redirect("/qr");
	});
});

//RENDER THE QR DISPLAY PAGE
app.get("/qr", (req, res) => {
	const qrPath = path.join(__dirname, "/qr.html");
	res.sendFile(qrPath);
});

//INITIALIZE SERVER
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
