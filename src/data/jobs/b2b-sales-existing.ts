import type { JobRpg } from "./types";

export const b2bSalesExisting: JobRpg = {
  id: "b2b-sales-existing",
  version: "1.0.0",
  displayName: "法人営業",
  subtitle: "既存顧客を担当するアカウント営業編",
  description:
    "お客様の課題を聞き、提案を通じて契約更新や追加提案につなげる仕事です。",
  icon: "briefcase",
  status: "published",
  estimatedMinutes: 7,
  targetUser: "高校生・大学生",
  serviceSetting: {
    scenarioTitle: "FlowBase 既存顧客対応編",
    serviceName: "FlowBase",
    serviceDescription:
      "社内申請、タスク管理、問い合わせ対応、承認フロー、簡易レポートをまとめて管理できる中小企業向けの業務改善クラウドサービスです。",
    customerName: "A食品",
    customerDescription:
      "従業員300名の食品メーカーです。営業部・総務部・品質管理部でFlowBaseを導入しています。",
    currentProblem:
      "最近、営業部の利用率が下がっています。契約更新まであと2か月で、このままだと解約リスクがあります。",
    playerRole: "あなたはFlowBaseを販売する会社の法人営業・既存顧客担当です。",
    mission:
      "A食品の利用率低下の原因を探り、解約リスクを下げ、必要であれば活用支援や追加提案につなげることです。",
  },
  scoring: {
    maxScorePerQuestion: 10,
    scoreMap: {
      good: 10,
      normal: 5,
      bad: 0,
    },
    showScoreDuringGame: false,
  },
  questions: [
    {
      id: "q1",
      phase: "起",
      businessProcess: "顧客状況の確認",
      title: "更新前の不穏なサイン",
      situation:
        "A食品の営業部で、ここ2か月、ログイン数と申請登録数が大きく下がっています。契約更新まであと2か月ですが、顧客からはまだ何も連絡がありません。",
      question: "あなたはまず何をしますか？",
      options: [
        {
          id: "A",
          text: "すぐに担当者へ連絡し、利用率が下がっている件について打ち合わせを依頼する",
          score: 5,
          feedbackType: "normal",
          feedback:
            "悪くない判断です。ただし、顧客に連絡する前に利用状況を確認しておくと、より具体的なヒアリングができます。",
        },
        {
          id: "B",
          text: "利用データを確認し、どの部署・機能で利用が落ちているか見てから連絡する",
          score: 10,
          feedbackType: "good",
          feedback:
            "良い初動です。まず事実を確認することで、顧客に聞くべきことや解約リスクの原因を整理できます。",
        },
        {
          id: "C",
          text: "上司とCSに共有し、解約リスクがある顧客として注意してもらう",
          score: 5,
          feedbackType: "normal",
          feedback:
            "共有すること自体は大切です。ただし、まず自分でも利用データを確認し、何が起きているかを整理する必要があります。",
        },
        {
          id: "D",
          text: "更新時期に合わせて、値引き案を準備しておく",
          score: 0,
          feedbackType: "bad",
          feedback:
            "注意が必要です。利用率が下がった理由が分からないまま値引きすると、顧客の本当の課題を見落とす可能性があります。",
        },
      ],
    },
    {
      id: "q2",
      phase: "起",
      businessProcess: "情報収集",
      title: "顧客に会う前の準備",
      situation:
        "A食品に連絡する前に、社内で確認できる情報を集めることにしました。限られた時間の中で、商談前に何を確認するかを決める必要があります。",
      question: "商談前に一番優先して確認するべき情報はどれですか？",
      options: [
        {
          id: "A",
          text: "契約金額、更新日、過去の商談メモを確認する",
          score: 5,
          feedbackType: "normal",
          feedback:
            "最低限の確認としては必要です。ただし、それだけでは利用率低下の理由や顧客の不満を想像する材料が足りません。",
        },
        {
          id: "B",
          text: "利用率、問い合わせ履歴、過去の提案内容、導入目的を確認する",
          score: 10,
          feedbackType: "good",
          feedback:
            "良い準備です。顧客に会う前に仮説を持てるため、ヒアリングの質が上がります。",
        },
        {
          id: "C",
          text: "競合サービスの価格や機能を確認する",
          score: 5,
          feedbackType: "normal",
          feedback:
            "競合情報は役に立つこともありますが、今回の本質は価格や機能差とは限りません。まずはA食品自身の利用状況を確認するべきです。",
        },
        {
          id: "D",
          text: "過去のメールだけざっと読み、まずは顧客の話を聞くことを優先する",
          score: 0,
          feedbackType: "bad",
          feedback:
            "注意が必要です。顧客の話を聞く姿勢は大切ですが、事前に分かる情報を見ずに臨むと、質問が浅くなりやすいです。",
        },
      ],
    },
    {
      id: "q3",
      phase: "承",
      businessProcess: "顧客接触",
      title: "解約リスクのある顧客への接触",
      situation:
        "利用データを見ると、営業部の利用が特に落ちていることが分かりました。A食品の担当者に連絡し、状況を確認する場を作りたいと考えています。",
      question: "どのように連絡しますか？",
      options: [
        {
          id: "A",
          text: "「更新時期が近いので、契約の打ち合わせをしましょう」と連絡する",
          score: 5,
          feedbackType: "normal",
          feedback:
            "間違いではありませんが、やや売り手都合に見えます。顧客にとって話すメリットが伝わりにくいです。",
        },
        {
          id: "B",
          text: "「利用状況を拝見し、活用状況の確認と支援のご相談をしたい」と連絡する",
          score: 10,
          feedbackType: "good",
          feedback:
            "良い連絡です。売り込みではなく、顧客の成果を支援する目的が伝わるため、自然に接点を作れます。",
        },
        {
          id: "C",
          text: "「解約を検討されていますか？」とストレートに聞く",
          score: 0,
          feedbackType: "bad",
          feedback:
            "直球すぎます。顧客がまだ明確に解約を考えていない場合でも、かえって解約を意識させる可能性があります。",
        },
        {
          id: "D",
          text: "新機能の資料を送り、「気になる点があればご連絡ください」と伝える",
          score: 5,
          feedbackType: "normal",
          feedback:
            "情報提供としては悪くありません。ただし、利用率低下の理由は分かりません。今回は対話の場を作る方が優先です。",
        },
      ],
    },
    {
      id: "q4",
      phase: "承",
      businessProcess: "ヒアリング",
      title: "顧客の本音を引き出せ",
      situation:
        "A食品の担当者と打ち合わせができました。担当者は「最近、営業部ではあまり使えていないんですよね。前のExcel管理に戻っている人もいます」と話しています。ただ、理由はまだはっきりしていません。",
      question: "あなたはどう聞きますか？",
      options: [
        {
          id: "A",
          text: "「どの業務でExcelに戻っているのか、具体的な場面を教えてください」と聞く",
          score: 10,
          feedbackType: "good",
          feedback:
            "良い聞き方です。「使えていない」という表面的な言葉を、具体的な業務場面に分解できます。",
        },
        {
          id: "B",
          text: "「営業部向けに、操作説明会をもう一度開きましょうか？」と提案する",
          score: 5,
          feedbackType: "normal",
          feedback:
            "悪くない提案ですが、まだ原因が十分に分かっていません。先に何に困っているのかを具体化した方がよいです。",
        },
        {
          id: "C",
          text: "「使いづらいと感じる機能はどれですか？」と聞く",
          score: 5,
          feedbackType: "normal",
          feedback:
            "具体的な質問ではあります。ただし、機能に原因を限定しすぎると、業務フローや運用ルールの問題を見落とす可能性があります。",
        },
        {
          id: "D",
          text: "「では価格を下げれば継続いただけますか？」と聞く",
          score: 0,
          feedbackType: "bad",
          feedback:
            "注意が必要です。問題が価格ではなく運用や使い方にある場合、値引きしても利用率は改善しません。",
        },
      ],
    },
    {
      id: "q5",
      phase: "承",
      businessProcess: "課題整理",
      title: "不満の裏にある本当の課題",
      situation:
        "ヒアリングの結果、営業部では「入力が面倒」「何をどこまで登録すればいいか分からない」という声があると分かりました。一方で、部長はFlowBaseで営業部の対応状況を見える化したいと考えています。",
      question: "この状況をどう整理しますか？",
      options: [
        {
          id: "A",
          text: "入力画面や項目が現場に合っていない可能性があると考える",
          score: 5,
          feedbackType: "normal",
          feedback:
            "あり得る見方です。ただし、画面や項目だけでなく、入力ルールや管理者側の使い方も含めて見る必要があります。",
        },
        {
          id: "B",
          text: "現場の入力ルール、管理者の確認方法、利用目的の共有が不足していると整理する",
          score: 10,
          feedbackType: "good",
          feedback:
            "良い整理です。単に「使われていない」ではなく、現場・管理者・目的のズレとして捉えられています。",
        },
        {
          id: "C",
          text: "営業部が忙しく、ツールを使う余裕がないことが原因だと考える",
          score: 0,
          feedbackType: "bad",
          feedback:
            "注意が必要です。忙しさは一因かもしれませんが、それだけで片付けると、運用や管理の問題を見落とします。",
        },
        {
          id: "D",
          text: "まず操作マニュアルとFAQを整理して送る",
          score: 5,
          feedbackType: "normal",
          feedback:
            "支援としては有効な場合があります。ただし、マニュアルだけで運用が変わるとは限りません。課題整理としては少し浅いです。",
        },
      ],
    },
    {
      id: "q6",
      phase: "転",
      businessProcess: "社内調整",
      title: "社内を巻き込め",
      situation:
        "A食品の課題を解決するには、営業だけでは足りません。CSには活用支援の相談、開発には設定変更やレポート機能の確認が必要になりそうです。",
      question: "社内にどう相談しますか？",
      options: [
        {
          id: "A",
          text: "顧客の発言メモをそのまま開発チームに共有し、対応可否を聞く",
          score: 0,
          feedbackType: "bad",
          feedback:
            "注意が必要です。開発側は背景や優先度が分からず、対応すべきか判断できません。",
        },
        {
          id: "B",
          text: "課題、影響、必要な支援、優先度を整理してCSと開発に相談する",
          score: 10,
          feedbackType: "good",
          feedback:
            "良い社内連携です。顧客の声をそのまま流すのではなく、判断できる形に整理できています。",
        },
        {
          id: "C",
          text: "まずCSに相談し、活用支援で解決できる範囲を確認する",
          score: 5,
          feedbackType: "normal",
          feedback:
            "悪くない判断です。ただし、開発や設定変更が関係する可能性があるなら、必要な論点を整理して関係者に共有した方が進みやすいです。",
        },
        {
          id: "D",
          text: "上司に状況を共有し、提案前に社内方針を確認する",
          score: 5,
          feedbackType: "normal",
          feedback:
            "共有は必要です。ただし、上司確認だけで止まると動きが遅くなります。関係者が判断できる材料を整理することが重要です。",
        },
      ],
    },
    {
      id: "q7",
      phase: "転",
      businessProcess: "提案設計",
      title: "守るか、攻めるか",
      situation:
        "CSと相談した結果、A食品には「営業部向けの再トレーニング」と「管理者向けの利用レポート設定」を提案できそうです。ただし、顧客はまだ更新自体を迷っています。",
      question: "どんな提案方針にしますか？",
      options: [
        {
          id: "A",
          text: "まず更新だけを取りに行き、追加提案は一切しない",
          score: 5,
          feedbackType: "normal",
          feedback:
            "安全な判断ではあります。ただし、利用率低下の原因を解決しなければ、更新後も同じ問題が残る可能性があります。",
        },
        {
          id: "B",
          text: "更新に加えて、利用定着のための支援プランを提案する",
          score: 10,
          feedbackType: "good",
          feedback:
            "良い提案方針です。追加提案を売上目的ではなく、顧客の成果を出すための手段として設計できています。",
        },
        {
          id: "C",
          text: "売上を増やすため、関連サービスをできるだけ多く提案する",
          score: 0,
          feedbackType: "bad",
          feedback:
            "注意が必要です。顧客の課題に合わない提案を増やすと、押し売りに見えて信頼を失いやすいです。",
        },
        {
          id: "D",
          text: "解約されそうなので、追加提案は怖くてやめる",
          score: 5,
          feedbackType: "normal",
          feedback:
            "慎重さはありますが、課題解決に必要な提案まで避けると、顧客の状況は改善しません。",
        },
      ],
    },
    {
      id: "q8",
      phase: "転",
      businessProcess: "条件交渉",
      title: "値引き要求への対応",
      situation:
        "提案後、A食品の担当者から「予算が厳しいので、もう少し安くなりませんか？」と相談されました。解約リスクもあるため、対応を間違えると失注につながります。",
      question: "あなたはどう対応しますか？",
      options: [
        {
          id: "A",
          text: "解約を避けるため、すぐに大きく値引きする",
          score: 0,
          feedbackType: "bad",
          feedback:
            "注意が必要です。理由を確認せずに値引きすると、サービスの価値ではなく価格だけで判断されやすくなります。",
        },
        {
          id: "B",
          text: "予算背景を確認し、支援範囲や期間を調整した代替案を出す",
          score: 10,
          feedbackType: "good",
          feedback:
            "良い対応です。価格だけを下げるのではなく、提供範囲や条件を調整することで、価値と予算のバランスを取れます。",
        },
        {
          id: "C",
          text: "「値引きはできません」とその場で即答する",
          score: 5,
          feedbackType: "normal",
          feedback:
            "方針としてはあり得ますが、顧客の予算背景を聞かずに断ると、交渉の余地を失う可能性があります。",
        },
        {
          id: "D",
          text: "「上司に確認します」とだけ言って、その場では何も聞かない",
          score: 5,
          feedbackType: "normal",
          feedback:
            "上司確認は必要なこともあります。ただし、予算理由や希望条件を聞かないと、上司に相談しても判断材料が足りません。",
        },
      ],
    },
    {
      id: "q9",
      phase: "結",
      businessProcess: "クロージング",
      title: "最後の壁、決裁者",
      situation:
        "A食品の担当者は提案に前向きです。ただし、最終判断は営業部長が行います。担当者からは「上に話しておきます」と言われましたが、このままだと提案の意図が正しく伝わるか分かりません。",
      question: "あなたはどう動きますか？",
      options: [
        {
          id: "A",
          text: "担当者に任せて、部長からの返事を待つ",
          score: 5,
          feedbackType: "normal",
          feedback:
            "担当者を信頼するのは大切ですが、決裁者に価値が正しく伝わらない可能性があります。",
        },
        {
          id: "B",
          text: "担当者に相談し、部長向けに課題・効果・費用を説明する場を依頼する",
          score: 10,
          feedbackType: "good",
          feedback:
            "良い動きです。担当者を飛ばさず、決裁者に必要な判断材料を届けようとしています。",
        },
        {
          id: "C",
          text: "担当者を飛ばして、営業部長に直接連絡する",
          score: 0,
          feedbackType: "bad",
          feedback:
            "注意が必要です。担当者の立場を無視すると、社内での信頼を失う可能性があります。",
        },
        {
          id: "D",
          text: "担当者が上申しやすいように、機能説明資料と見積書をまとめて送る",
          score: 5,
          feedbackType: "normal",
          feedback:
            "支援としては悪くありません。ただし、決裁者には機能説明だけでなく、課題・効果・費用を簡潔に伝える必要があります。",
        },
      ],
    },
    {
      id: "q10",
      phase: "結",
      businessProcess: "振り返り",
      title: "契約後に差が出る営業",
      situation:
        "A食品はFlowBaseの契約更新を決め、営業部向けの再トレーニングも実施することになりました。これで一段落ですが、今後の関係づくりが重要です。",
      question: "最後にどんな動きをしますか？",
      options: [
        {
          id: "A",
          text: "契約が取れたので、しばらく連絡しない",
          score: 0,
          feedbackType: "bad",
          feedback:
            "注意が必要です。受注後に放置すると、また利用率が下がる可能性があります。既存営業では、契約後のフォローが次の信頼につながります。",
        },
        {
          id: "B",
          text: "1か月後に成果確認ミーティングを設定し、利用状況と次の改善テーマを確認する",
          score: 10,
          feedbackType: "good",
          feedback:
            "良い動きです。契約後の成果確認を行うことで、顧客の定着支援と次回提案のきっかけを作れます。",
        },
        {
          id: "C",
          text: "契約直後に、すぐ別の商品を提案する",
          score: 5,
          feedbackType: "normal",
          feedback:
            "追加提案の意識はありますが、タイミングが早すぎると売り込みに見えます。まずは今回の支援の成果を確認する方が自然です。",
        },
        {
          id: "D",
          text: "お礼メールだけ送って終える",
          score: 5,
          feedbackType: "normal",
          feedback:
            "お礼は大切ですが、それだけでは関係づくりとしては弱いです。次の確認の場を作ると、継続的な関係につながります。",
        },
      ],
    },
  ],
  resultMessages: [
    {
      minScorePercent: 85,
      maxScorePercent: 100,
      title: "かなり鋭い判断ができています",
      message:
        "顧客の状況を見ながら、提案や社内調整につなげる流れをよく理解できています。",
    },
    {
      minScorePercent: 70,
      maxScorePercent: 84,
      title: "安定した判断ができています",
      message:
        "営業の仕事の流れをつかみながら、顧客に合わせた動きができています。",
    },
    {
      minScorePercent: 55,
      maxScorePercent: 69,
      title: "仕事の流れをつかめています",
      message:
        "ここからは、情報収集・課題整理・社内調整の判断を磨くと、より深く理解できます。",
    },
    {
      minScorePercent: 40,
      maxScorePercent: 54,
      title: "まずは全体像を体験できました",
      message:
        "もう一度挑戦すると、営業がどこで何を考える仕事なのかが見えてきます。",
    },
    {
      minScorePercent: 0,
      maxScorePercent: 39,
      title: "もう一度挑戦してみましょう",
      message:
        "営業はただ売るだけではなく、顧客の状況を理解して関係を作る仕事です。もう一度プレイすると判断のポイントが見えてきます。",
    },
  ],
  nextJobSuggestions: [
    {
      jobId: "customer-success",
      reason: "契約後の顧客支援に近い仕事です",
    },
    {
      jobId: "product-manager",
      reason: "顧客要望をどうプロダクトに反映するか見えてきます",
    },
  ],
};
