export interface Skill {
  id: string;
  name: string;
  category: "Architecture & UI" | "Concurrency & Performance" | "Data & Persistence" | "Monetization & Store" | "Language & Systems" | "Quality & Security";
  description: string;
  tags: string[];
  prompt: string;
  githubPath: string;
}

export const GITHUB_REPO = "https://github.com/adityakmr7/buildr-ios-skills";
export const RAW_INSTALL_URL = "https://raw.githubusercontent.com/adityakmr7/buildr-ios-skills/main/install.sh";

export const CATEGORIES = [
  "All",
  "Architecture & UI",
  "Concurrency & Performance",
  "Data & Persistence",
  "Monetization & Store",
  "Language & Systems",
  "Quality & Security"
] as const;

export const SKILLS: Skill[] = [
  {
    id: "buildr-ui",
    name: "Buildr SwiftUI Pro",
    category: "Architecture & UI",
    description: "Modern SwiftUI standards (iOS 17+ / iOS 18+). Covers Observation (@Observable), NavigationStack, 44x44pt touch targets, and API migrations.",
    tags: ["iOS 17+", "SwiftUI", "Observation", "NavigationStack"],
    prompt: "Review this view using buildr-ui. Migrate it to iOS 17 Observation (@Observable), replace deprecated APIs, and ensure all buttons meet the 44x44pt touch target.",
    githubPath: "skills/buildr-ui"
  },
  {
    id: "buildr-design",
    name: "Buildr SwiftUI Design",
    category: "Architecture & UI",
    description: "Enforces Apple HIG and native iOS aesthetics. Emphasizes restraint over decoration, strict 4/8-pt grid discipline, semantic system colors, and native controls.",
    tags: ["Apple HIG", "4/8-pt Grid", "System Colors", "Clean UI"],
    prompt: "Apply buildr-design to this screen. Strip out non-native card wrappers, snap all padding to the 4/8-pt grid, and use semantic grouped backgrounds.",
    githubPath: "skills/buildr-design"
  },
  {
    id: "buildr-polish",
    name: "Buildr Interface Polish",
    category: "Architecture & UI",
    description: "Micro-interactions inspired by 'make-interfaces-feel-better'. Concentric corner radii, tactile spring press feedback, sensory haptics, optical alignment, and tabular digits.",
    tags: ["Micro-interactions", "Haptics", "Concentric Radii", "Tactile"],
    prompt: "Polish this card component with buildr-polish. Ensure concentric corner radii, tactile spring scale on press, light sensory haptics, and tabular numbers.",
    githubPath: "skills/buildr-polish"
  },
  {
    id: "buildr-arch",
    name: "Buildr Architecture Patterns",
    category: "Architecture & UI",
    description: "Architectural playbook for Swift and iOS. Covers pattern selection (MVVM, Clean Architecture, TCA, Coordinator), dependency injection, and UDF.",
    tags: ["Architecture", "MVVM", "Clean Architecture", "UDF", "TCA"],
    prompt: "Use buildr-arch to design the state and business logic for this feature. Provide a unidirectional data flow (UDF) model and decouple dependencies with client structs.",
    githubPath: "skills/buildr-arch"
  },
  {
    id: "buildr-uikit-bridge",
    name: "Buildr UIKit Bridge",
    category: "Architecture & UI",
    description: "Expert guide for UIKit and SwiftUI interoperability. Covers UIViewRepresentable, UIViewControllerRepresentable, Coordinator delegates, and UIHostingController.",
    tags: ["UIKit", "SwiftUI", "UIViewRepresentable", "Coordinators"],
    prompt: "Bridge this UIKit view controller into SwiftUI using buildr-uikit-bridge with a clean Coordinator delegate pattern and two-way state binding.",
    githubPath: "skills/buildr-uikit-bridge"
  },
  {
    id: "buildr-multiplatform",
    name: "Buildr Multiplatform",
    category: "Architecture & UI",
    description: "iPadOS and macOS adaptations. Covers Stage Manager multitasking, Split View, Drag & Drop (Transferable), pointer styles, and Mac Catalyst menu bars.",
    tags: ["iPadOS", "macOS", "Stage Manager", "Drag & Drop", "Pointer"],
    prompt: "Adapt this screen for iPadOS using buildr-multiplatform. Add dynamic windowing support for Stage Manager, trackpad hover effects, and Drag & Drop via Transferable.",
    githubPath: "skills/buildr-multiplatform"
  },
  {
    id: "buildr-concurrency",
    name: "Buildr Concurrency Pro",
    category: "Concurrency & Performance",
    description: "Complete guide for Swift 6 data-race safety, actor isolation, Sendable enforcement, structured concurrency (TaskGroup, async let), and cancellation.",
    tags: ["Swift 6", "Concurrency", "Actors", "Sendable", "Async/Await"],
    prompt: "Use buildr-concurrency to audit this file. Fix all Swift 6 strict concurrency errors, check for actor reentrancy hazards across suspension points, and verify Sendable conformance.",
    githubPath: "skills/buildr-concurrency"
  },
  {
    id: "buildr-perf",
    name: "Buildr Performance Audit",
    category: "Concurrency & Performance",
    description: "Diagnostic workflow for eliminating SwiftUI view churn (Self._printChanges()), memory leaks, retain cycles, scroll hitches, and Instruments profiling.",
    tags: ["Instruments", "View Churn", "Memory Leaks", "Scroll Hitches"],
    prompt: "Run an buildr-perf audit on this feed view. Diagnose why view bodies are recomputing on every state change, and check for escaping closure retain cycles.",
    githubPath: "skills/buildr-perf"
  },
  {
    id: "buildr-swiftdata",
    name: "Buildr SwiftData Pro",
    category: "Data & Persistence",
    description: "Modern SwiftData persistence patterns. Covers @Model schemas, safe #Predicate expressions, ModelActor background processing, and CloudKit sync constraints.",
    tags: ["SwiftData", "Predicates", "CloudKit", "ModelActor", "Migrations"],
    prompt: "Use buildr-swiftdata to review our SwiftData schema. Verify relationship delete rules, make sure #Predicate expressions won't crash at runtime, and check CloudKit sync compliance.",
    githubPath: "skills/buildr-swiftdata"
  },
  {
    id: "buildr-coredata",
    name: "Buildr Core Data Expert",
    category: "Data & Persistence",
    description: "Enterprise Core Data architecture. Covers thread-safe context confinement, high-performance batch operations (NSBatchInsertRequest), and persistent history tracking.",
    tags: ["Core Data", "SQLite", "Batch Operations", "Context Confinement"],
    prompt: "Apply buildr-coredata to optimize our data ingestion. Replace item-by-item inserts with NSBatchInsertRequest and enforce context confinement with perform.",
    githubPath: "skills/buildr-coredata"
  },
  {
    id: "buildr-storekit",
    name: "Buildr StoreKit 2 & Paywalls",
    category: "Monetization & Store",
    description: "Expert guide for Apple's StoreKit 2 and In-App Purchases. Product queries, purchase flows, auto-renewable subscriptions, SubscriptionStoreView, and .storekit testing.",
    tags: ["StoreKit 2", "In-App Purchases", "Subscriptions", "Paywalls"],
    prompt: "Implement StoreKit 2 auto-renewable subscriptions with buildr-storekit. Add a native SubscriptionStoreView paywall and JWS verification.",
    githubPath: "skills/buildr-storekit"
  },
  {
    id: "buildr-appstore",
    name: "Buildr App Store & Privacy",
    category: "Monetization & Store",
    description: "App Store readiness and privacy compliance. Covers PrivacyInfo.xcprivacy (Required Reasons APIs, tracking domains), review rejection prevention, and ASO.",
    tags: ["Privacy Manifest", "App Review", "ASO", "Compliance"],
    prompt: "Audit our app for App Store submission using buildr-appstore. Generate the PrivacyInfo.xcprivacy manifest and check for rejection traps.",
    githubPath: "skills/buildr-appstore"
  },
  {
    id: "buildr-api",
    name: "Buildr API Design Guidelines",
    category: "Language & Systems",
    description: "Enforces official Swift API Design Guidelines. Covers call-site clarity, grammatical argument labels, naming conventions, mutating/nonmutating pairs, and DocC.",
    tags: ["Swift", "API Design", "Naming Conventions", "DocC"],
    prompt: "Refactor this manager using buildr-api. Ensure all call sites read like clear English phrases, fix argument label prepositions, and follow the sort/sorted naming rules.",
    githubPath: "skills/buildr-api"
  },
  {
    id: "buildr-format",
    name: "Buildr FormatStyle Pro",
    category: "Language & Systems",
    description: "Modern Foundation FormatStyle and .formatted() APIs. Replaces legacy DateFormatter and NumberFormatter with type-safe formatting for dates, currencies, and numbers.",
    tags: ["Foundation", "FormatStyle", "Currency", "Dates", "Numbers"],
    prompt: "Use buildr-format to eliminate DateFormatter and NumberFormatter instances in this file. Replace them with Foundation .formatted() styles for localized currency and relative dates.",
    githubPath: "skills/buildr-format"
  },
  {
    id: "buildr-intents",
    name: "Buildr App Intents",
    category: "Language & Systems",
    description: "Apple App Intents framework (iOS 16+, 17, 18+). Covers AppIntent, AppEntity, EntityQuery, AppShortcutsProvider, interactive widgets, Siri, and Apple Intelligence.",
    tags: ["App Intents", "Siri", "Shortcuts", "Apple Intelligence"],
    prompt: "Use buildr-intents to create an AppIntent for logging user activity. Include an AppEntity and EntityQuery, and expose it to Siri via AppShortcutsProvider.",
    githubPath: "skills/buildr-intents"
  },
  {
    id: "buildr-widgets",
    name: "Buildr Widgets & Live Activities",
    category: "Language & Systems",
    description: "Deep engineering guide for WidgetKit and ActivityKit. TimelineProvider, interactive widgets, Live Activities, Dynamic Island (4 presentations), and App Groups.",
    tags: ["WidgetKit", "ActivityKit", "Live Activities", "Dynamic Island"],
    prompt: "Use buildr-widgets to implement an ActivityKit Live Activity with all 4 Dynamic Island presentations (compactLeading, compactTrailing, minimal, expanded).",
    githubPath: "skills/buildr-widgets"
  },
  {
    id: "buildr-background",
    name: "Buildr Background Execution",
    category: "Language & Systems",
    description: "Apple platform background execution. Covers BGTaskScheduler (app refresh and processing tasks), background URLSession transfers, and silent push notifications.",
    tags: ["BGTaskScheduler", "Background Tasks", "URLSession", "Silent Push"],
    prompt: "Use buildr-background to set up a BGAppRefreshTask with BGTaskScheduler. Include an expiration handler to avoid 0x8badf00d watchdog termination.",
    githubPath: "skills/buildr-background"
  },
  {
    id: "buildr-testing",
    name: "Buildr Swift Testing Pro",
    category: "Quality & Security",
    description: "Apple Swift Testing framework (@Test, @Suite, #expect, #require, parameterized table-driven tests, async testing, and XCTest migrations).",
    tags: ["Swift Testing", "QA", "Unit Tests", "Parameterized"],
    prompt: "Write unit tests for this authentication service using buildr-testing. Use @Suite, @Test, #expect vs try #require, and parameterized table-driven tests.",
    githubPath: "skills/buildr-testing"
  },
  {
    id: "buildr-debugger",
    name: "Buildr Debugger Agent",
    category: "Quality & Security",
    description: "Crash triage (EXC_BAD_ACCESS, SIGABRT, 0x8badf00d), LLDB command sequences (v, po, expr), symbolication, and Thread/Address Sanitizer workflows.",
    tags: ["Debugging", "LLDB", "Crashes", "Sanitizers"],
    prompt: "Use buildr-debugger to triage this crash log. It crashed with EXC_BAD_ACCESS in Thread 3. Give me the LLDB commands to inspect the memory frame.",
    githubPath: "skills/buildr-debugger"
  },
  {
    id: "buildr-logs",
    name: "Buildr Logging & Metrics",
    category: "Quality & Security",
    description: "Apple Unified Logging (os.Logger), privacy redactions (mask: .hash), OSSignposter Instruments tracing, and MetricKit field telemetry.",
    tags: ["Unified Logging", "os.Logger", "Signposts", "MetricKit"],
    prompt: "Use buildr-logs to set up structured logging in our networking layer using os.Logger. Ensure tokens and emails are masked with privacy: .private(mask: .hash).",
    githubPath: "skills/buildr-logs"
  },
  {
    id: "buildr-security",
    name: "Buildr Security Expert",
    category: "Quality & Security",
    description: "iOS Keychain Services wrapper (SecItem), CryptoKit (AES-GCM, Secure Enclave keys), LocalAuthentication (Face ID / Touch ID), and certificate pinning.",
    tags: ["Keychain", "CryptoKit", "Face ID", "Certificate Pinning"],
    prompt: "Apply buildr-security to our token storage. Move auth tokens into the iOS Keychain with kSecAttrAccessibleWhenUnlockedThisDeviceOnly, and add Face ID authentication.",
    githubPath: "skills/buildr-security"
  }
];
