// PokoBot Zero-Defect QA & Real Integration Test Runner
const BASE_URL = "https://ping-clone-poc.vercel.app";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName} -> ${details}`);
  }
}

async function runTests() {
  console.log(`\n======================================================`);
  console.log(`  POKOBOT ZERO-DEFECT ARCHITECTURAL QA SUITE`);
  console.log(`  Target: ${BASE_URL}`);
  console.log(`  Timestamp: ${new Date().toISOString()}`);
  console.log(`======================================================\n`);

  // --- 1. SYSTEM HEALTH & API STATUS ---
  console.log(`[TEST GROUP 1] System Status & Gateway Health`);
  try {
    const res = await fetch(`${BASE_URL}/api/status`);
    const data = await res.json();
    assert(res.status === 200, "GET /api/status returns HTTP 200");
    assert(data.status === "ok", "Status payload confirms 'ok'");
    assert(data.engine.whatsapp.includes("WAHA"), "Engine identifies as WAHA");
    assert(data.engine.safety.self_chat_loop_guard === true, "Loop guard reported as true");
  } catch (err) {
    assert(false, "GET /api/status network error", err.message);
  }

  // --- 2. OPENAPI 3.1.0 SPECIFICATION ---
  console.log(`\n[TEST GROUP 2] OpenAPI 3.1.0 Schema Verification`);
  try {
    const res = await fetch(`${BASE_URL}/api/openapi`);
    const data = await res.json();
    assert(res.status === 200, "GET /api/openapi returns HTTP 200");
    assert(data.openapi === "3.1.0", "Valid OpenAPI 3.1.0 version tag");
    assert(Boolean(data.paths["/api/sendText"]), "Spec contains /api/sendText path");
  } catch (err) {
    assert(false, "GET /api/openapi network error", err.message);
  }

  // --- 3. MODEL CONTEXT PROTOCOL (MCP) EXHAUSTIVE SUITE ---
  console.log(`\n[TEST GROUP 3] Model Context Protocol (MCP) Server Suite`);
  try {
    // 3a. CORS Preflight
    const optRes = await fetch(`${BASE_URL}/api/mcp`, { method: "OPTIONS" });
    assert(optRes.status === 204, "OPTIONS /api/mcp returns 204 Preflight");
    assert(optRes.headers.get("access-control-allow-origin") === "*", "MCP CORS Allow-Origin: *");

    // 3b. GET Server Info & Tools Catalog
    const getRes = await fetch(`${BASE_URL}/api/mcp`);
    const getData = await getRes.json();
    assert(getRes.status === 200, "GET /api/mcp returns HTTP 200");
    assert(getData.server.name === "pokobot-mcp-server", "MCP server name verified");
    assert(Array.isArray(getData.tools) && getData.tools.length === 6, "MCP exposes exactly 6 tools");
    assert(Boolean(getData.clientsConfig.claudeDesktop), "Claude Desktop configuration provided");
    assert(Boolean(getData.clientsConfig.cursor), "Cursor IDE configuration provided");

    // 3c. MCP Protocol Initialize Handshake
    const initRes = await fetch(`${BASE_URL}/api/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 101, method: "initialize" }),
    });
    const initData = await initRes.json();
    assert(initRes.status === 200, "POST /api/mcp 'initialize' returns 200");
    assert(initData.result.protocolVersion === "2024-11-05", "Protocol version 2024-11-05 verified");

    // 3d. MCP Tools List
    const listRes = await fetch(`${BASE_URL}/api/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 102, method: "tools/list" }),
    });
    const listData = await listRes.json();
    assert(listData.result.tools.length === 6, "tools/list returned 6 tools");

    // 3e. MCP Tool Call: pokobot_send_whatsapp_message
    const call1 = await fetch(`${BASE_URL}/api/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 103,
        method: "tools/call",
        params: {
          name: "pokobot_send_whatsapp_message",
          arguments: { phone: "6281234567890", message: "Automated QA Verification Ping" },
        },
      }),
    });
    const callData1 = await call1.json();
    assert(call1.status === 200, "Tool call 'pokobot_send_whatsapp_message' returns 200");
    assert(callData1.result.content[0].text.includes("berhasil dikirim"), "Message dispatch content verified");

    // 3f. MCP Tool Call: pokobot_get_chats
    const call2 = await fetch(`${BASE_URL}/api/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 104,
        method: "tools/call",
        params: { name: "pokobot_get_chats", arguments: { limit: 2 } },
      }),
    });
    const callData2 = await call2.json();
    assert(call2.status === 200, "Tool call 'pokobot_get_chats' returns 200");
    assert(callData2.result.content[0].text.includes("Lead 1"), "Chats list contains customer profile");

    // 3g. MCP Negative Test: Missing Required Parameters
    const callBadArgs = await fetch(`${BASE_URL}/api/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 105,
        method: "tools/call",
        params: { name: "pokobot_send_whatsapp_message", arguments: {} },
      }),
    });
    const callBadData = await callBadArgs.json();
    assert(callBadArgs.status === 400, "Missing tool args returns HTTP 400");
    assert(callBadData.error.code === -32602, "JSON-RPC error code -32602 (Invalid params)");

    // 3h. MCP Negative Test: Unknown Tool Name
    const callUnknown = await fetch(`${BASE_URL}/api/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 106,
        method: "tools/call",
        params: { name: "unknown_hack_tool", arguments: {} },
      }),
    });
    const callUnknownData = await callUnknown.json();
    assert(callUnknown.status === 404, "Unknown tool call returns HTTP 404");
    assert(callUnknownData.error.code === -32601, "JSON-RPC error code -32601 (Method not found)");

    // 3i. MCP Negative Test: Malformed JSON syntax
    const callMalformed = await fetch(`${BASE_URL}/api/mcp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "THIS_IS_NOT_JSON",
    });
    const malformedData = await callMalformed.json();
    assert(callMalformed.status === 400, "Malformed JSON body returns HTTP 400");
    assert(malformedData.error.code === -32700, "JSON-RPC error code -32700 (Parse error)");
  } catch (err) {
    assert(false, "MCP Suite network error", err.message);
  }

  // --- 4. MESSAGE DISPATCHER (/api/sendText) SUITE ---
  console.log(`\n[TEST GROUP 4] Message Dispatcher (/api/sendText) Suite`);
  try {
    // 4a. CORS Preflight
    const optRes = await fetch(`${BASE_URL}/api/sendText`, { method: "OPTIONS" });
    assert(optRes.status === 204, "OPTIONS /api/sendText returns 204 Preflight");

    // 4b. GET Documentation
    const getRes = await fetch(`${BASE_URL}/api/sendText`);
    assert(getRes.status === 200, "GET /api/sendText returns HTTP 200 overview");

    // 4c. POST Valid Dispatch
    const sendValid = await fetch(`${BASE_URL}/api/sendText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer pk_live_fluxy_pokobot_enterprise",
      },
      body: JSON.stringify({
        chatId: "6281234567890@c.us",
        text: "Unit Test Broadcast from Zero-Defect Suite",
        session: "default",
      }),
    });
    const sendValidData = await sendValid.json();
    assert(sendValid.status === 200, "POST /api/sendText valid dispatch returns 200");
    assert(sendValidData.status === "success", "Payload confirmed status: success");
    assert(Boolean(sendValidData.messageId), `Generated messageId: ${sendValidData.messageId}`);
    assert(sendValidData.destination === "6281234567890@c.us", "Destination format normalized");

    // 4d. POST Missing Destination
    const sendMissingDest = await fetch(`${BASE_URL}/api/sendText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Missing chatId test" }),
    });
    assert(sendMissingDest.status === 422, "Missing chatId returns HTTP 422 Unprocessable");

    // 4e. POST Missing Text
    const sendMissingText = await fetch(`${BASE_URL}/api/sendText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: "6281234567890@c.us", text: "   " }),
    });
    assert(sendMissingText.status === 422, "Whitespace-only text returns HTTP 422 Unprocessable");

    // 4f. POST Unauthorized Key
    const sendBadAuth = await fetch(`${BASE_URL}/api/sendText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer unauthorized_hacker_key",
      },
      body: JSON.stringify({ chatId: "6281234567890@c.us", text: "Test auth" }),
    });
    assert(sendBadAuth.status === 401, "Invalid API key returns HTTP 401 Unauthorized");
  } catch (err) {
    assert(false, "/api/sendText Suite network error", err.message);
  }

  // --- 5. WEBHOOK GATEWAY (/api/webhook) DEFENSIVE SUITE ---
  console.log(`\n[TEST GROUP 5] Webhook Gateway Defensive Suite`);
  try {
    // 5a. Critical Anti-Loop Guard (fromMe: true)
    const loopRes = await fetch(`${BASE_URL}/api/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "message",
        payload: {
          id: `msg_loop_${Date.now()}`,
          fromMe: true, // Bot's own outbound message!
          from: "6281234567890@c.us",
          body: "Echo test",
        },
      }),
    });
    const loopData = await loopRes.json();
    assert(loopRes.status === 200, "Anti-loop webhook returns 200 OK");
    assert(loopData.status === "ignored", "Anti-loop: fromMe: true is strictly ignored");
    assert(loopData.reason.includes("fromMe: true"), "Diagnostic reason correctly reports anti-loop");

    // 5b. Group Isolation Guard (@g.us)
    const groupRes = await fetch(`${BASE_URL}/api/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "message",
        payload: {
          id: `msg_group_${Date.now()}`,
          fromMe: false,
          from: "120363024849182390@g.us",
          body: "Hello group spam",
        },
      }),
    });
    const groupData = await groupRes.json();
    assert(groupData.status === "ignored", "Group message (@g.us) strictly isolated/ignored");

    // 5c. Legitimate Inbound Message (Ready for Any New User)
    const testMsgId = `legit_msg_${Date.now()}`;
    const legitRes = await fetch(`${BASE_URL}/api/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "message",
        payload: {
          id: testMsgId,
          fromMe: false,
          from: "6281234567890@c.us",
          body: "Halo kak, ongkir ke Jakarta Pusat berapa ya?",
        },
      }),
    });
    const legitData = await legitRes.json();
    assert(legitRes.status === 200, "Legitimate inbound message returns 200 OK");
    assert(legitData.status === "accepted", "Message accepted for processing");
    assert(legitData.intentDetected === "Cek Ongkir Otomatis", "AI Intent recognized: Cek Ongkir Otomatis");

    // 5d. Replay / Deduplication Guard
    const duplicateRes = await fetch(`${BASE_URL}/api/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "message",
        payload: {
          id: testMsgId, // Same message ID!
          fromMe: false,
          from: "6281234567890@c.us",
          body: "Halo kak, ongkir ke Jakarta Pusat berapa ya?",
        },
      }),
    });
    const duplicateData = await duplicateRes.json();
    assert(duplicateData.status === "ignored", "Deduplication cache blocked duplicate delivery");
  } catch (err) {
    assert(false, "Webhook Suite network error", err.message);
  }

  // --- 6. HIGH-CONCURRENCY STRESS TEST ---
  console.log(`\n[TEST GROUP 6] High-Concurrency Stress Test (25 Concurrent Requests)`);
  try {
    const startTime = Date.now();
    const concurrentRequests = Array.from({ length: 25 }, (_, i) =>
      fetch(`${BASE_URL}/api/status`).then((r) => r.status)
    );
    const results = await Promise.all(concurrentRequests);
    const duration = Date.now() - startTime;
    const all200 = results.every((status) => status === 200);
    assert(all200, `All 25 concurrent requests succeeded with HTTP 200 in ${duration}ms`);
  } catch (err) {
    assert(false, "Stress test network error", err.message);
  }

  // --- FINAL SCOREBOARD ---
  console.log(`\n======================================================`);
  console.log(`  QA SUMMARY SCOREBOARD`);
  console.log(`  Total Checks Executed : ${totalTests}`);
  console.log(`  Passed (Verified)     : ${passedTests}`);
  console.log(`  Failed                : ${failedTests}`);
  console.log(`  Zero-Defect Status    : ${failedTests === 0 ? "PASSED (100% CLEAN)" : "FAILED"}`);
  console.log(`======================================================\n`);

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests();
