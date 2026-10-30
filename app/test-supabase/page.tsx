import { Suspense } from "react";
import { connection } from "next/server";
import { supabase } from "@/lib/supabase";

type TestConnectionRow = {
  message: string | null;
  created_at: string;
};

async function TestConnectionList() {
  // リクエストごとに最新データを取得する
  await connection();

  const { data, error } = await supabase
    .from("test_connection")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded border border-red-300 bg-red-50 p-4 text-red-700">
        <p className="font-bold">エラーが発生しました</p>
        <pre className="mt-2 whitespace-pre-wrap text-sm">
          {JSON.stringify(error, null, 2)}
        </pre>
      </div>
    );
  }

  const rows = (data ?? []) as TestConnectionRow[];

  if (rows.length === 0) {
    return <p className="text-gray-500">データがありません（0件）</p>;
  }

  return (
    <>
      <p className="mb-2 text-sm text-gray-500">{rows.length} 件取得しました</p>
      <ul className="divide-y rounded border">
        {rows.map((row, i) => (
          <li key={i} className="p-3">
            <p>{row.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(row.created_at).toLocaleString("ja-JP")}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function TestSupabasePage() {
  return (
    <main className="mx-auto w-full max-w-2xl p-8">
      <h1 className="mb-4 text-2xl font-bold">Supabase 接続テスト</h1>
      <Suspense fallback={<p>読み込み中...</p>}>
        <TestConnectionList />
      </Suspense>
    </main>
  );
}
