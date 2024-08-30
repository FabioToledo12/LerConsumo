
const __awaiter = (this && this.__awaiter) || ((thisArg, _arguments, P, generator) => {
    function adopt(value) { return value instanceof P ? value : new P((resolve) => { resolve(value); }); }
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
    return new (P || (P = Promise))((resolve, reject) => {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
});
// biome-ignore lint/complexity/useOptionalChain: <explanation>
const __importDefault = (this && this.__importDefault) || ((mod) => (mod && mod.__esModule) ? mod : { "default": mod });
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const uuid_1 = require("uuid");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let _a;
    let _b;
    const { image, customer_code, measure_datetime, measure_type } = req.body;
    // Validação básica dos campos
    if (!image || !customer_code || !measure_datetime || !measure_type) {
        return res.status(400).json({
            error_code: "INVALID_DATA",
            error_description: "Missing required fields",
        });
    }
    // Verifica se o tipo de medição é válido
    if (!["WATER", "GAS"].includes(measure_type.toUpperCase())) {
        return res.status(400).json({
            error_code: "INVALID_TYPE",
            error_description: "Tipo de medição não permitida",
        });
    }
    try {
        console.log("Sending request to Google Vision API...");
        const response = yield axios_1.default.post(`https://vision.googleapis.com/v1/images:annotate?key=${process.env.GEMINI_API_KEY}`, {
            requests: [
                {
                    image: { content: image },
                    features: [{ type: "TEXT_DETECTION" }],
                },
            ],
        });
        // Verifique se a resposta contém dados antes de acessar as propriedades
        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
                const annotations = (_b = (_a = response.data.responses) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.textAnnotations;
        if (!annotations || annotations.length === 0) {
            return res.status(500).json({
                error_code: "INTERNAL_ERROR",
                error_description: "No text found in the image",
            });
        }
        // Captura o valor reconhecido pela API
        const measure_value = Number.parseInt(annotations[0].description);
        const measureUUID = (0, uuid_1.v4)();
        const imageUrl = `https://example.com/images/${measureUUID}`;
        // Retorna os dados conforme solicitado
        return res.status(200).json({
            image_url: imageUrl,
            measure_value,
            measure_uuid: measureUUID,
        });
    }
    catch (error) {
        // Use `any` para capturar qualquer tipo de erro
        console.error("Error processing the image:", (error === null || error === void 0 ? void 0 : error.message) || "Unknown error");
        return res.status(500).json({
            error_code: "INTERNAL_ERROR",
            error_description: "An error occurred while processing the image",
        });
    }
});
exports.uploadImage = uploadImage;
