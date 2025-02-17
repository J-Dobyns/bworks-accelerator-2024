import { createRequire } from 'module';const require = createRequire(import.meta.url);
import {
  __asyncGenerator,
  __await
} from "./chunk-JOAX3MFJ.js";
import {
  FirebaseApp,
  FirebaseApps,
  VERSION,
  ɵAngularFireSchedulers,
  ɵAppCheckInstances,
  ɵgetAllInstancesOf,
  ɵgetDefaultInstanceOf,
  ɵzoneWrap
} from "./chunk-KSCJT346.js";
import {
  InjectionToken,
  Injector,
  NgModule,
  NgZone,
  Optional,
  makeEnvironmentProviders,
  require_cjs,
  require_operators,
  setClassMetadata,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-RQJUF76U.js";
import {
  Component,
  FirebaseError,
  _getProvider,
  _registerComponent,
  getApp,
  getModularInstance,
  registerVersion
} from "./chunk-WGPCUCPR.js";
import {
  __async,
  __toESM
} from "./chunk-INDP74QC.js";

// node_modules/@angular/fire/fesm2022/angular-fire-vertexai-preview.mjs
var import_rxjs = __toESM(require_cjs(), 1);
var import_operators = __toESM(require_operators(), 1);

// node_modules/@firebase/vertexai-preview/dist/esm/index.esm2017.js
var name = "@firebase/vertexai-preview";
var version = "0.0.3";
var VERTEX_TYPE = "vertexAI";
var DEFAULT_LOCATION = "us-central1";
var DEFAULT_BASE_URL = "https://firebaseml.googleapis.com";
var DEFAULT_API_VERSION = "v2beta";
var PACKAGE_VERSION = version;
var LANGUAGE_TAG = "gl-js";
var VertexAIService = class {
  constructor(app, authProvider, appCheckProvider, options) {
    var _a;
    this.app = app;
    this.options = options;
    const appCheck = appCheckProvider === null || appCheckProvider === void 0 ? void 0 : appCheckProvider.getImmediate({
      optional: true
    });
    const auth = authProvider === null || authProvider === void 0 ? void 0 : authProvider.getImmediate({
      optional: true
    });
    this.auth = auth || null;
    this.appCheck = appCheck || null;
    this.location = ((_a = this.options) === null || _a === void 0 ? void 0 : _a.location) || DEFAULT_LOCATION;
  }
  _delete() {
    return Promise.resolve();
  }
};
var VertexAIError = class _VertexAIError extends FirebaseError {
  /**
   * Constructs a new instance of the `VertexAIError` class.
   *
   * @param code - The error code from {@link VertexAIErrorCode}.
   * @param message - A human-readable message describing the error.
   * @param customErrorData - Optional error data.
   */
  constructor(code, message, customErrorData) {
    const service = VERTEX_TYPE;
    const serviceName = "VertexAI";
    const fullCode = `${service}/${code}`;
    const fullMessage = `${serviceName}: ${message} (${fullCode}).`;
    super(fullCode, fullMessage);
    this.code = code;
    this.message = message;
    this.customErrorData = customErrorData;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _VertexAIError);
    }
    Object.setPrototypeOf(this, _VertexAIError.prototype);
    this.toString = () => fullMessage;
  }
};
var Task;
(function(Task2) {
  Task2["GENERATE_CONTENT"] = "generateContent";
  Task2["STREAM_GENERATE_CONTENT"] = "streamGenerateContent";
  Task2["COUNT_TOKENS"] = "countTokens";
})(Task || (Task = {}));
var RequestUrl = class {
  constructor(model, task, apiSettings, stream, requestOptions) {
    this.model = model;
    this.task = task;
    this.apiSettings = apiSettings;
    this.stream = stream;
    this.requestOptions = requestOptions;
  }
  toString() {
    var _a;
    const apiVersion = DEFAULT_API_VERSION;
    const baseUrl = ((_a = this.requestOptions) === null || _a === void 0 ? void 0 : _a.baseUrl) || DEFAULT_BASE_URL;
    let url = `${baseUrl}/${apiVersion}`;
    url += `/projects/${this.apiSettings.project}`;
    url += `/locations/${this.apiSettings.location}`;
    url += `/${this.model}`;
    url += `:${this.task}`;
    if (this.stream) {
      url += "?alt=sse";
    }
    return url;
  }
  /**
   * If the model needs to be passed to the backend, it needs to
   * include project and location path.
   */
  get fullModelString() {
    let modelString = `projects/${this.apiSettings.project}`;
    modelString += `/locations/${this.apiSettings.location}`;
    modelString += `/${this.model}`;
    return modelString;
  }
};
function getClientHeaders() {
  const loggingTags = [];
  loggingTags.push(`${LANGUAGE_TAG}/${PACKAGE_VERSION}`);
  loggingTags.push(`fire/${PACKAGE_VERSION}`);
  return loggingTags.join(" ");
}
function getHeaders(url) {
  return __async(this, null, function* () {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("x-goog-api-client", getClientHeaders());
    headers.append("x-goog-api-key", url.apiSettings.apiKey);
    if (url.apiSettings.getAppCheckToken) {
      const appCheckToken = yield url.apiSettings.getAppCheckToken();
      if (appCheckToken && !appCheckToken.error) {
        headers.append("X-Firebase-AppCheck", appCheckToken.token);
      }
    }
    if (url.apiSettings.getAuthToken) {
      const authToken = yield url.apiSettings.getAuthToken();
      if (authToken) {
        headers.append("Authorization", `Firebase ${authToken.accessToken}`);
      }
    }
    return headers;
  });
}
function constructRequest(model, task, apiSettings, stream, body, requestOptions) {
  return __async(this, null, function* () {
    const url = new RequestUrl(model, task, apiSettings, stream, requestOptions);
    return {
      url: url.toString(),
      fetchOptions: Object.assign(Object.assign({}, buildFetchOptions(requestOptions)), {
        method: "POST",
        headers: yield getHeaders(url),
        body
      })
    };
  });
}
function makeRequest(model, task, apiSettings, stream, body, requestOptions) {
  return __async(this, null, function* () {
    const url = new RequestUrl(model, task, apiSettings, stream, requestOptions);
    let response;
    try {
      const request = yield constructRequest(model, task, apiSettings, stream, body, requestOptions);
      response = yield fetch(request.url, request.fetchOptions);
      if (!response.ok) {
        let message = "";
        let errorDetails;
        try {
          const json = yield response.json();
          message = json.error.message;
          if (json.error.details) {
            message += ` ${JSON.stringify(json.error.details)}`;
            errorDetails = json.error.details;
          }
        } catch (e) {
        }
        throw new VertexAIError("fetch-error", `Error fetching from ${url}: [${response.status} ${response.statusText}] ${message}`, {
          status: response.status,
          statusText: response.statusText,
          errorDetails
        });
      }
    } catch (e) {
      let err = e;
      if (e.code !== "fetch-error" && e instanceof Error) {
        err = new VertexAIError("error", `Error fetching from ${url.toString()}: ${e.message}`);
        err.stack = e.stack;
      }
      throw err;
    }
    return response;
  });
}
function buildFetchOptions(requestOptions) {
  const fetchOptions = {};
  if ((requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) && (requestOptions === null || requestOptions === void 0 ? void 0 : requestOptions.timeout) >= 0) {
    const abortController = new AbortController();
    const signal = abortController.signal;
    setTimeout(() => abortController.abort(), requestOptions.timeout);
    fetchOptions.signal = signal;
  }
  return fetchOptions;
}
var POSSIBLE_ROLES = ["user", "model", "function", "system"];
var HarmCategory;
(function(HarmCategory2) {
  HarmCategory2["HARM_CATEGORY_UNSPECIFIED"] = "HARM_CATEGORY_UNSPECIFIED";
  HarmCategory2["HARM_CATEGORY_HATE_SPEECH"] = "HARM_CATEGORY_HATE_SPEECH";
  HarmCategory2["HARM_CATEGORY_SEXUALLY_EXPLICIT"] = "HARM_CATEGORY_SEXUALLY_EXPLICIT";
  HarmCategory2["HARM_CATEGORY_HARASSMENT"] = "HARM_CATEGORY_HARASSMENT";
  HarmCategory2["HARM_CATEGORY_DANGEROUS_CONTENT"] = "HARM_CATEGORY_DANGEROUS_CONTENT";
})(HarmCategory || (HarmCategory = {}));
var HarmBlockThreshold;
(function(HarmBlockThreshold2) {
  HarmBlockThreshold2["HARM_BLOCK_THRESHOLD_UNSPECIFIED"] = "HARM_BLOCK_THRESHOLD_UNSPECIFIED";
  HarmBlockThreshold2["BLOCK_LOW_AND_ABOVE"] = "BLOCK_LOW_AND_ABOVE";
  HarmBlockThreshold2["BLOCK_MEDIUM_AND_ABOVE"] = "BLOCK_MEDIUM_AND_ABOVE";
  HarmBlockThreshold2["BLOCK_ONLY_HIGH"] = "BLOCK_ONLY_HIGH";
  HarmBlockThreshold2["BLOCK_NONE"] = "BLOCK_NONE";
})(HarmBlockThreshold || (HarmBlockThreshold = {}));
var HarmBlockMethod;
(function(HarmBlockMethod2) {
  HarmBlockMethod2["HARM_BLOCK_METHOD_UNSPECIFIED"] = "HARM_BLOCK_METHOD_UNSPECIFIED";
  HarmBlockMethod2["SEVERITY"] = "SEVERITY";
  HarmBlockMethod2["PROBABILITY"] = "PROBABILITY";
})(HarmBlockMethod || (HarmBlockMethod = {}));
var HarmProbability;
(function(HarmProbability2) {
  HarmProbability2["HARM_PROBABILITY_UNSPECIFIED"] = "HARM_PROBABILITY_UNSPECIFIED";
  HarmProbability2["NEGLIGIBLE"] = "NEGLIGIBLE";
  HarmProbability2["LOW"] = "LOW";
  HarmProbability2["MEDIUM"] = "MEDIUM";
  HarmProbability2["HIGH"] = "HIGH";
})(HarmProbability || (HarmProbability = {}));
var HarmSeverity;
(function(HarmSeverity2) {
  HarmSeverity2["HARM_SEVERITY_UNSPECIFIED"] = "HARM_SEVERITY_UNSPECIFIED";
  HarmSeverity2["HARM_SEVERITY_NEGLIGIBLE"] = "HARM_SEVERITY_NEGLIGIBLE";
  HarmSeverity2["HARM_SEVERITY_LOW"] = "HARM_SEVERITY_LOW";
  HarmSeverity2["HARM_SEVERITY_MEDIUM"] = "HARM_SEVERITY_MEDIUM";
  HarmSeverity2["HARM_SEVERITY_HIGH"] = "HARM_SEVERITY_HIGH";
})(HarmSeverity || (HarmSeverity = {}));
var BlockReason;
(function(BlockReason2) {
  BlockReason2["BLOCKED_REASON_UNSPECIFIED"] = "BLOCKED_REASON_UNSPECIFIED";
  BlockReason2["SAFETY"] = "SAFETY";
  BlockReason2["OTHER"] = "OTHER";
})(BlockReason || (BlockReason = {}));
var FinishReason;
(function(FinishReason2) {
  FinishReason2["FINISH_REASON_UNSPECIFIED"] = "FINISH_REASON_UNSPECIFIED";
  FinishReason2["STOP"] = "STOP";
  FinishReason2["MAX_TOKENS"] = "MAX_TOKENS";
  FinishReason2["SAFETY"] = "SAFETY";
  FinishReason2["RECITATION"] = "RECITATION";
  FinishReason2["OTHER"] = "OTHER";
})(FinishReason || (FinishReason = {}));
var FunctionCallingMode;
(function(FunctionCallingMode2) {
  FunctionCallingMode2["MODE_UNSPECIFIED"] = "MODE_UNSPECIFIED";
  FunctionCallingMode2["AUTO"] = "AUTO";
  FunctionCallingMode2["ANY"] = "ANY";
  FunctionCallingMode2["NONE"] = "NONE";
})(FunctionCallingMode || (FunctionCallingMode = {}));
var FunctionDeclarationSchemaType;
(function(FunctionDeclarationSchemaType2) {
  FunctionDeclarationSchemaType2["STRING"] = "STRING";
  FunctionDeclarationSchemaType2["NUMBER"] = "NUMBER";
  FunctionDeclarationSchemaType2["INTEGER"] = "INTEGER";
  FunctionDeclarationSchemaType2["BOOLEAN"] = "BOOLEAN";
  FunctionDeclarationSchemaType2["ARRAY"] = "ARRAY";
  FunctionDeclarationSchemaType2["OBJECT"] = "OBJECT";
})(FunctionDeclarationSchemaType || (FunctionDeclarationSchemaType = {}));
function addHelpers(response) {
  response.text = () => {
    if (response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        console.warn(`This response had ${response.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`);
      }
      if (hadBadFinishReason(response.candidates[0])) {
        throw new VertexAIError("response-error", `Response error: ${formatBlockErrorMessage(response)}. Response body stored in error.response`, {
          response
        });
      }
      return getText(response);
    } else if (response.promptFeedback) {
      throw new VertexAIError("response-error", `Text not available. ${formatBlockErrorMessage(response)}`, {
        response
      });
    }
    return "";
  };
  response.functionCalls = () => {
    if (response.candidates && response.candidates.length > 0) {
      if (response.candidates.length > 1) {
        console.warn(`This response had ${response.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`);
      }
      if (hadBadFinishReason(response.candidates[0])) {
        throw new VertexAIError("response-error", `Response error: ${formatBlockErrorMessage(response)}. Response body stored in error.response`, {
          response
        });
      }
      return getFunctionCalls(response);
    } else if (response.promptFeedback) {
      throw new VertexAIError("response-error", `Function call not available. ${formatBlockErrorMessage(response)}`, {
        response
      });
    }
    return void 0;
  };
  return response;
}
function getText(response) {
  var _a, _b, _c, _d;
  const textStrings = [];
  if ((_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0].content) === null || _b === void 0 ? void 0 : _b.parts) {
    for (const part of (_d = (_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0].content) === null || _d === void 0 ? void 0 : _d.parts) {
      if (part.text) {
        textStrings.push(part.text);
      }
    }
  }
  if (textStrings.length > 0) {
    return textStrings.join("");
  } else {
    return "";
  }
}
function getFunctionCalls(response) {
  var _a, _b, _c, _d;
  const functionCalls = [];
  if ((_b = (_a = response.candidates) === null || _a === void 0 ? void 0 : _a[0].content) === null || _b === void 0 ? void 0 : _b.parts) {
    for (const part of (_d = (_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0].content) === null || _d === void 0 ? void 0 : _d.parts) {
      if (part.functionCall) {
        functionCalls.push(part.functionCall);
      }
    }
  }
  if (functionCalls.length > 0) {
    return functionCalls;
  } else {
    return void 0;
  }
}
var badFinishReasons = [FinishReason.RECITATION, FinishReason.SAFETY];
function hadBadFinishReason(candidate) {
  return !!candidate.finishReason && badFinishReasons.includes(candidate.finishReason);
}
function formatBlockErrorMessage(response) {
  var _a, _b, _c;
  let message = "";
  if ((!response.candidates || response.candidates.length === 0) && response.promptFeedback) {
    message += "Response was blocked";
    if ((_a = response.promptFeedback) === null || _a === void 0 ? void 0 : _a.blockReason) {
      message += ` due to ${response.promptFeedback.blockReason}`;
    }
    if ((_b = response.promptFeedback) === null || _b === void 0 ? void 0 : _b.blockReasonMessage) {
      message += `: ${response.promptFeedback.blockReasonMessage}`;
    }
  } else if ((_c = response.candidates) === null || _c === void 0 ? void 0 : _c[0]) {
    const firstCandidate = response.candidates[0];
    if (hadBadFinishReason(firstCandidate)) {
      message += `Candidate was blocked due to ${firstCandidate.finishReason}`;
      if (firstCandidate.finishMessage) {
        message += `: ${firstCandidate.finishMessage}`;
      }
    }
  }
  return message;
}
var responseLineRE = /^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;
function processStream(response) {
  const inputStream = response.body.pipeThrough(new TextDecoderStream("utf8", {
    fatal: true
  }));
  const responseStream = getResponseStream(inputStream);
  const [stream1, stream2] = responseStream.tee();
  return {
    stream: generateResponseSequence(stream1),
    response: getResponsePromise(stream2)
  };
}
function getResponsePromise(stream) {
  return __async(this, null, function* () {
    const allResponses = [];
    const reader = stream.getReader();
    while (true) {
      const {
        done,
        value
      } = yield reader.read();
      if (done) {
        return addHelpers(aggregateResponses(allResponses));
      }
      allResponses.push(value);
    }
  });
}
function generateResponseSequence(stream) {
  return __asyncGenerator(this, arguments, function* generateResponseSequence_1() {
    const reader = stream.getReader();
    while (true) {
      const {
        value,
        done
      } = yield __await(reader.read());
      if (done) {
        break;
      }
      yield yield __await(addHelpers(value));
    }
  });
}
function getResponseStream(inputStream) {
  const reader = inputStream.getReader();
  const stream = new ReadableStream({
    start(controller) {
      let currentText = "";
      return pump();
      function pump() {
        return reader.read().then(({
          value,
          done
        }) => {
          if (done) {
            if (currentText.trim()) {
              controller.error(new VertexAIError("parse-failed", "Failed to parse stream"));
              return;
            }
            controller.close();
            return;
          }
          currentText += value;
          let match = currentText.match(responseLineRE);
          let parsedResponse;
          while (match) {
            try {
              parsedResponse = JSON.parse(match[1]);
            } catch (e) {
              controller.error(new VertexAIError("parse-failed", `Error parsing JSON response: "${match[1]}`));
              return;
            }
            controller.enqueue(parsedResponse);
            currentText = currentText.substring(match[0].length);
            match = currentText.match(responseLineRE);
          }
          return pump();
        });
      }
    }
  });
  return stream;
}
function aggregateResponses(responses) {
  const lastResponse = responses[responses.length - 1];
  const aggregatedResponse = {
    promptFeedback: lastResponse === null || lastResponse === void 0 ? void 0 : lastResponse.promptFeedback
  };
  for (const response of responses) {
    if (response.candidates) {
      for (const candidate of response.candidates) {
        const i = candidate.index;
        if (!aggregatedResponse.candidates) {
          aggregatedResponse.candidates = [];
        }
        if (!aggregatedResponse.candidates[i]) {
          aggregatedResponse.candidates[i] = {
            index: candidate.index
          };
        }
        aggregatedResponse.candidates[i].citationMetadata = candidate.citationMetadata;
        aggregatedResponse.candidates[i].finishReason = candidate.finishReason;
        aggregatedResponse.candidates[i].finishMessage = candidate.finishMessage;
        aggregatedResponse.candidates[i].safetyRatings = candidate.safetyRatings;
        if (candidate.content && candidate.content.parts) {
          if (!aggregatedResponse.candidates[i].content) {
            aggregatedResponse.candidates[i].content = {
              role: candidate.content.role || "user",
              parts: []
            };
          }
          const newPart = {};
          for (const part of candidate.content.parts) {
            if (part.text) {
              newPart.text = part.text;
            }
            if (part.functionCall) {
              newPart.functionCall = part.functionCall;
            }
            if (Object.keys(newPart).length === 0) {
              newPart.text = "";
            }
            aggregatedResponse.candidates[i].content.parts.push(newPart);
          }
        }
      }
    }
  }
  return aggregatedResponse;
}
function generateContentStream(apiSettings, model, params, requestOptions) {
  return __async(this, null, function* () {
    const response = yield makeRequest(
      model,
      Task.STREAM_GENERATE_CONTENT,
      apiSettings,
      /* stream */
      true,
      JSON.stringify(params),
      requestOptions
    );
    return processStream(response);
  });
}
function generateContent(apiSettings, model, params, requestOptions) {
  return __async(this, null, function* () {
    const response = yield makeRequest(
      model,
      Task.GENERATE_CONTENT,
      apiSettings,
      /* stream */
      false,
      JSON.stringify(params),
      requestOptions
    );
    const responseJson = yield response.json();
    const enhancedResponse = addHelpers(responseJson);
    return {
      response: enhancedResponse
    };
  });
}
function formatSystemInstruction(input) {
  if (input == null) {
    return void 0;
  } else if (typeof input === "string") {
    return {
      role: "system",
      parts: [{
        text: input
      }]
    };
  } else if (input.text) {
    return {
      role: "system",
      parts: [input]
    };
  } else if (input.parts) {
    if (!input.role) {
      return {
        role: "system",
        parts: input.parts
      };
    } else {
      return input;
    }
  }
}
function formatNewContent(request) {
  let newParts = [];
  if (typeof request === "string") {
    newParts = [{
      text: request
    }];
  } else {
    for (const partOrString of request) {
      if (typeof partOrString === "string") {
        newParts.push({
          text: partOrString
        });
      } else {
        newParts.push(partOrString);
      }
    }
  }
  return assignRoleToPartsAndValidateSendMessageRequest(newParts);
}
function assignRoleToPartsAndValidateSendMessageRequest(parts) {
  const userContent = {
    role: "user",
    parts: []
  };
  const functionContent = {
    role: "function",
    parts: []
  };
  let hasUserContent = false;
  let hasFunctionContent = false;
  for (const part of parts) {
    if ("functionResponse" in part) {
      functionContent.parts.push(part);
      hasFunctionContent = true;
    } else {
      userContent.parts.push(part);
      hasUserContent = true;
    }
  }
  if (hasUserContent && hasFunctionContent) {
    throw new VertexAIError("invalid-content", "Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.");
  }
  if (!hasUserContent && !hasFunctionContent) {
    throw new VertexAIError("invalid-content", "No Content is provided for sending chat message.");
  }
  if (hasUserContent) {
    return userContent;
  }
  return functionContent;
}
function formatGenerateContentInput(params) {
  let formattedRequest;
  if (params.contents) {
    formattedRequest = params;
  } else {
    const content = formatNewContent(params);
    formattedRequest = {
      contents: [content]
    };
  }
  if (params.systemInstruction) {
    formattedRequest.systemInstruction = formatSystemInstruction(params.systemInstruction);
  }
  return formattedRequest;
}
var VALID_PART_FIELDS = ["text", "inlineData", "functionCall", "functionResponse"];
var VALID_PARTS_PER_ROLE = {
  user: ["text", "inlineData"],
  function: ["functionResponse"],
  model: ["text", "functionCall"],
  // System instructions shouldn't be in history anyway.
  system: ["text"]
};
var VALID_PREVIOUS_CONTENT_ROLES = {
  user: ["model"],
  function: ["model"],
  model: ["user", "function"],
  // System instructions shouldn't be in history.
  system: []
};
function validateChatHistory(history) {
  let prevContent = null;
  for (const currContent of history) {
    const {
      role,
      parts
    } = currContent;
    if (!prevContent && role !== "user") {
      throw new VertexAIError("invalid-content", `First Content should be with role 'user', got ${role}`);
    }
    if (!POSSIBLE_ROLES.includes(role)) {
      throw new VertexAIError("invalid-content", `Each item should include role field. Got ${role} but valid roles are: ${JSON.stringify(POSSIBLE_ROLES)}`);
    }
    if (!Array.isArray(parts)) {
      throw new VertexAIError("invalid-content", `Content should have 'parts' but property with an array of Parts`);
    }
    if (parts.length === 0) {
      throw new VertexAIError("invalid-content", `Each Content should have at least one part`);
    }
    const countFields = {
      text: 0,
      inlineData: 0,
      functionCall: 0,
      functionResponse: 0
    };
    for (const part of parts) {
      for (const key of VALID_PART_FIELDS) {
        if (key in part) {
          countFields[key] += 1;
        }
      }
    }
    const validParts = VALID_PARTS_PER_ROLE[role];
    for (const key of VALID_PART_FIELDS) {
      if (!validParts.includes(key) && countFields[key] > 0) {
        throw new VertexAIError("invalid-content", `Content with role '${role}' can't contain '${key}' part`);
      }
    }
    if (prevContent) {
      const validPreviousContentRoles = VALID_PREVIOUS_CONTENT_ROLES[role];
      if (!validPreviousContentRoles.includes(prevContent.role)) {
        throw new VertexAIError("invalid-content", `Content with role '${role} can't follow '${prevContent.role}'. Valid previous roles: ${JSON.stringify(VALID_PREVIOUS_CONTENT_ROLES)}`);
      }
    }
    prevContent = currContent;
  }
}
var SILENT_ERROR = "SILENT_ERROR";
var ChatSession = class {
  constructor(apiSettings, model, params, requestOptions) {
    this.model = model;
    this.params = params;
    this.requestOptions = requestOptions;
    this._history = [];
    this._sendPromise = Promise.resolve();
    this._apiSettings = apiSettings;
    if (params === null || params === void 0 ? void 0 : params.history) {
      validateChatHistory(params.history);
      this._history = params.history;
    }
  }
  /**
   * Gets the chat history so far. Blocked prompts are not added to history.
   * Blocked candidates are not added to history, nor are the prompts that
   * generated them.
   */
  getHistory() {
    return __async(this, null, function* () {
      yield this._sendPromise;
      return this._history;
    });
  }
  /**
   * Sends a chat message and receives a non-streaming
   * {@link GenerateContentResult}
   */
  sendMessage(request) {
    return __async(this, null, function* () {
      var _a, _b, _c, _d, _e;
      yield this._sendPromise;
      const newContent = formatNewContent(request);
      const generateContentRequest = {
        safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
        generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
        tools: (_c = this.params) === null || _c === void 0 ? void 0 : _c.tools,
        toolConfig: (_d = this.params) === null || _d === void 0 ? void 0 : _d.toolConfig,
        systemInstruction: (_e = this.params) === null || _e === void 0 ? void 0 : _e.systemInstruction,
        contents: [...this._history, newContent]
      };
      let finalResult = {};
      this._sendPromise = this._sendPromise.then(() => generateContent(this._apiSettings, this.model, generateContentRequest, this.requestOptions)).then((result) => {
        var _a2, _b2;
        if (result.response.candidates && result.response.candidates.length > 0) {
          this._history.push(newContent);
          const responseContent = {
            parts: ((_a2 = result.response.candidates) === null || _a2 === void 0 ? void 0 : _a2[0].content.parts) || [],
            // Response seems to come back without a role set.
            role: ((_b2 = result.response.candidates) === null || _b2 === void 0 ? void 0 : _b2[0].content.role) || "model"
          };
          this._history.push(responseContent);
        } else {
          const blockErrorMessage = formatBlockErrorMessage(result.response);
          if (blockErrorMessage) {
            console.warn(`sendMessage() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
          }
        }
        finalResult = result;
      });
      yield this._sendPromise;
      return finalResult;
    });
  }
  /**
   * Sends a chat message and receives the response as a
   * {@link GenerateContentStreamResult} containing an iterable stream
   * and a response promise.
   */
  sendMessageStream(request) {
    return __async(this, null, function* () {
      var _a, _b, _c, _d, _e;
      yield this._sendPromise;
      const newContent = formatNewContent(request);
      const generateContentRequest = {
        safetySettings: (_a = this.params) === null || _a === void 0 ? void 0 : _a.safetySettings,
        generationConfig: (_b = this.params) === null || _b === void 0 ? void 0 : _b.generationConfig,
        tools: (_c = this.params) === null || _c === void 0 ? void 0 : _c.tools,
        toolConfig: (_d = this.params) === null || _d === void 0 ? void 0 : _d.toolConfig,
        systemInstruction: (_e = this.params) === null || _e === void 0 ? void 0 : _e.systemInstruction,
        contents: [...this._history, newContent]
      };
      const streamPromise = generateContentStream(this._apiSettings, this.model, generateContentRequest, this.requestOptions);
      this._sendPromise = this._sendPromise.then(() => streamPromise).catch((_ignored) => {
        throw new Error(SILENT_ERROR);
      }).then((streamResult) => streamResult.response).then((response) => {
        if (response.candidates && response.candidates.length > 0) {
          this._history.push(newContent);
          const responseContent = Object.assign({}, response.candidates[0].content);
          if (!responseContent.role) {
            responseContent.role = "model";
          }
          this._history.push(responseContent);
        } else {
          const blockErrorMessage = formatBlockErrorMessage(response);
          if (blockErrorMessage) {
            console.warn(`sendMessageStream() was unsuccessful. ${blockErrorMessage}. Inspect response object for details.`);
          }
        }
      }).catch((e) => {
        if (e.message !== SILENT_ERROR) {
          console.error(e);
        }
      });
      return streamPromise;
    });
  }
};
function countTokens(apiSettings, model, params, requestOptions) {
  return __async(this, null, function* () {
    const response = yield makeRequest(model, Task.COUNT_TOKENS, apiSettings, false, JSON.stringify(params), requestOptions);
    return response.json();
  });
}
var GenerativeModel = class {
  constructor(vertexAI, modelParams, requestOptions) {
    var _a, _b, _c, _d;
    if (!((_b = (_a = vertexAI.app) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.apiKey)) {
      throw new VertexAIError("no-api-key", `The "apiKey" field is empty in the local Firebase config. Firebase VertexAI requires this field to contain a valid API key.`);
    } else if (!((_d = (_c = vertexAI.app) === null || _c === void 0 ? void 0 : _c.options) === null || _d === void 0 ? void 0 : _d.projectId)) {
      throw new VertexAIError("no-project-id", `The "projectId" field is empty in the local Firebase config. Firebase VertexAI requires this field to contain a valid project ID.`);
    } else {
      this._apiSettings = {
        apiKey: vertexAI.app.options.apiKey,
        project: vertexAI.app.options.projectId,
        location: vertexAI.location
      };
      if (vertexAI.appCheck) {
        this._apiSettings.getAppCheckToken = () => vertexAI.appCheck.getToken();
      }
      if (vertexAI.auth) {
        this._apiSettings.getAuthToken = () => vertexAI.auth.getToken();
      }
    }
    if (modelParams.model.includes("/")) {
      if (modelParams.model.startsWith("models/")) {
        this.model = `publishers/google/${modelParams.model}`;
      } else {
        this.model = modelParams.model;
      }
    } else {
      this.model = `publishers/google/models/${modelParams.model}`;
    }
    this.generationConfig = modelParams.generationConfig || {};
    this.safetySettings = modelParams.safetySettings || [];
    this.tools = modelParams.tools;
    this.toolConfig = modelParams.toolConfig;
    this.systemInstruction = formatSystemInstruction(modelParams.systemInstruction);
    this.requestOptions = requestOptions || {};
  }
  /**
   * Makes a single non-streaming call to the model
   * and returns an object containing a single {@link GenerateContentResponse}.
   */
  generateContent(request) {
    return __async(this, null, function* () {
      const formattedParams = formatGenerateContentInput(request);
      return generateContent(this._apiSettings, this.model, Object.assign({
        generationConfig: this.generationConfig,
        safetySettings: this.safetySettings,
        tools: this.tools,
        toolConfig: this.toolConfig,
        systemInstruction: this.systemInstruction
      }, formattedParams), this.requestOptions);
    });
  }
  /**
   * Makes a single streaming call to the model
   * and returns an object containing an iterable stream that iterates
   * over all chunks in the streaming response as well as
   * a promise that returns the final aggregated response.
   */
  generateContentStream(request) {
    return __async(this, null, function* () {
      const formattedParams = formatGenerateContentInput(request);
      return generateContentStream(this._apiSettings, this.model, Object.assign({
        generationConfig: this.generationConfig,
        safetySettings: this.safetySettings,
        tools: this.tools,
        toolConfig: this.toolConfig,
        systemInstruction: this.systemInstruction
      }, formattedParams), this.requestOptions);
    });
  }
  /**
   * Gets a new {@link ChatSession} instance which can be used for
   * multi-turn chats.
   */
  startChat(startChatParams) {
    return new ChatSession(this._apiSettings, this.model, Object.assign({
      tools: this.tools,
      toolConfig: this.toolConfig,
      systemInstruction: this.systemInstruction
    }, startChatParams), this.requestOptions);
  }
  /**
   * Counts the tokens in the provided request.
   */
  countTokens(request) {
    return __async(this, null, function* () {
      const formattedParams = formatGenerateContentInput(request);
      return countTokens(this._apiSettings, this.model, formattedParams);
    });
  }
};
function getVertexAI(app = getApp(), options) {
  app = getModularInstance(app);
  const vertexProvider = _getProvider(app, VERTEX_TYPE);
  return vertexProvider.getImmediate({
    identifier: (options === null || options === void 0 ? void 0 : options.location) || DEFAULT_LOCATION
  });
}
function getGenerativeModel(vertexAI, modelParams, requestOptions) {
  if (!modelParams.model) {
    throw new VertexAIError("no-model", `Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })`);
  }
  return new GenerativeModel(vertexAI, modelParams, requestOptions);
}
function registerVertex() {
  _registerComponent(new Component(
    VERTEX_TYPE,
    (container, {
      instanceIdentifier: location
    }) => {
      const app = container.getProvider("app").getImmediate();
      const auth = container.getProvider("auth-internal");
      const appCheckProvider = container.getProvider("app-check-internal");
      return new VertexAIService(app, auth, appCheckProvider, {
        location
      });
    },
    "PUBLIC"
    /* ComponentType.PUBLIC */
  ).setMultipleInstances(true));
  registerVersion(name, version);
  registerVersion(name, version, "esm2017");
}
registerVertex();

// node_modules/@angular/fire/fesm2022/angular-fire-vertexai-preview.mjs
var VertexAI = class {
  constructor(vertexai) {
    return vertexai;
  }
};
var VERTEX_AI_PROVIDER_NAME = "vertexai";
var VertexAIInstances = class {
  constructor() {
    return ɵgetAllInstancesOf(VERTEX_AI_PROVIDER_NAME);
  }
};
var vertexAIInstance$ = (0, import_rxjs.timer)(0, 300).pipe((0, import_operators.concatMap)(() => (0, import_rxjs.from)(ɵgetAllInstancesOf(VERTEX_AI_PROVIDER_NAME))), (0, import_operators.distinct)());
var PROVIDED_VERTEX_AI_INSTANCES = new InjectionToken("angularfire2.vertexai-instances");
function defaultVertexAIInstanceFactory(provided, defaultApp) {
  const defaultVertexAI = ɵgetDefaultInstanceOf(VERTEX_AI_PROVIDER_NAME, provided, defaultApp);
  return defaultVertexAI && new VertexAI(defaultVertexAI);
}
function vertexAIInstanceFactory(fn) {
  return (zone, injector) => {
    const vertexAI = zone.runOutsideAngular(() => fn(injector));
    return new VertexAI(vertexAI);
  };
}
var VERTEX_AI_INSTANCES_PROVIDER = {
  provide: VertexAIInstances,
  deps: [[new Optional(), PROVIDED_VERTEX_AI_INSTANCES]]
};
var DEFAULT_VERTEX_AI_INSTANCE_PROVIDER = {
  provide: VertexAI,
  useFactory: defaultVertexAIInstanceFactory,
  deps: [[new Optional(), PROVIDED_VERTEX_AI_INSTANCES], FirebaseApp]
};
var VertexAIModule = class _VertexAIModule {
  constructor() {
    registerVersion("angularfire", VERSION.full, "vertexai");
  }
  static ɵfac = function VertexAIModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _VertexAIModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _VertexAIModule
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [DEFAULT_VERTEX_AI_INSTANCE_PROVIDER, VERTEX_AI_INSTANCES_PROVIDER]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(VertexAIModule, [{
    type: NgModule,
    args: [{
      providers: [DEFAULT_VERTEX_AI_INSTANCE_PROVIDER, VERTEX_AI_INSTANCES_PROVIDER]
    }]
  }], () => [], null);
})();
function provideVertexAI(fn, ...deps) {
  registerVersion("angularfire", VERSION.full, "vertexai");
  return makeEnvironmentProviders([DEFAULT_VERTEX_AI_INSTANCE_PROVIDER, VERTEX_AI_INSTANCES_PROVIDER, {
    provide: PROVIDED_VERTEX_AI_INSTANCES,
    useFactory: vertexAIInstanceFactory(fn),
    multi: true,
    deps: [NgZone, Injector, ɵAngularFireSchedulers, FirebaseApps, [new Optional(), ɵAppCheckInstances], ...deps]
  }]);
}
var getVertexAI2 = ɵzoneWrap(getVertexAI, true);
var getGenerativeModel2 = ɵzoneWrap(getGenerativeModel, true);
export {
  BlockReason,
  ChatSession,
  FinishReason,
  FunctionCallingMode,
  FunctionDeclarationSchemaType,
  GenerativeModel,
  HarmBlockMethod,
  HarmBlockThreshold,
  HarmCategory,
  HarmProbability,
  HarmSeverity,
  POSSIBLE_ROLES,
  VertexAI,
  VertexAIError,
  VertexAIInstances,
  VertexAIModule,
  getGenerativeModel2 as getGenerativeModel,
  getVertexAI2 as getVertexAI,
  provideVertexAI,
  vertexAIInstance$
};
/*! Bundled license information:

@firebase/vertexai-preview/dist/esm/index.esm2017.js:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=@angular_fire_vertexai-preview.js.map
