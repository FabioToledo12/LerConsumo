
// biome-ignore lint/complexity/useOptionalChain: <explanation>
const __importDefault = (this && this.__importDefault) || ((mod) => (mod && mod.__esModule) ? mod : { "default": mod });
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadRoute_1 = __importDefault(require("./routes/uploadRoute"));
// biome-ignore lint/style/noCommaOperator: <explanation>
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/", uploadRoute_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
