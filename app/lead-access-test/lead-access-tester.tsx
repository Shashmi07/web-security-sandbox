"use client";

import { useState } from "react";

const leads = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    owner: "User A",
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    owner: "User B",
  },
];

type Result = {
  method: string;
  owner: string;
  status: number;
  body: string;
};

export default function LeadAccessTester() {
  const [results, setResults] = useState<Result[]>([]);
  const [pending, setPending] = useState("");

  async function runRequest(method: "GET" | "PATCH" | "DELETE", id: string, owner: string) {
    const key = `${method}:${id}`;
    setPending(key);

    try {
      const response = await fetch(`/api/leads/${id}`, {
        method,
        headers: method === "PATCH" ? { "Content-Type": "application/json" } : undefined,
        body: method === "PATCH" ? JSON.stringify({ name: `${owner} updated lead` }) : undefined,
      });
      const body = await response.json();

      setResults((current) => [
        {
          method,
          owner,
          status: response.status,
          body: JSON.stringify(body),
        },
        ...current,
      ]);
    } catch {
      setResults((current) => [
        { method, owner, status: 0, body: "Request failed before receiving a response." },
        ...current,
      ]);
    } finally {
      setPending("");
    }
  }

  return (
    <>
      <div className="lead-test-grid">
        {leads.map((lead) => (
          <article className="lead-test-panel" key={lead.id}>
            <h2>{lead.owner}&apos;s lead</h2>
            <code>{lead.id}</code>
            <div className="lead-test-actions">
              {(["GET", "PATCH", "DELETE"] as const).map((method) => {
                const key = `${method}:${lead.id}`;
                return (
                  <button
                    key={method}
                    type="button"
                    disabled={pending !== "" || (method === "DELETE" && pending !== "")}
                    onClick={() => runRequest(method, lead.id, lead.owner)}
                  >
                    {pending === key ? "Testing..." : method}
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>
      <div className="lead-test-results" aria-live="polite">
        {results.length === 0 ? (
          <p className="muted">Run a request to see the authorization response.</p>
        ) : (
          results.map((result, index) => (
            <p key={`${result.method}-${result.owner}-${index}`}>
              <strong>{result.method} {result.owner}</strong>: HTTP {result.status}{" "}
              <code>{result.body}</code>
            </p>
          ))
        )}
      </div>
    </>
  );
}
