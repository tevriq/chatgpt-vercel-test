import SwiftUI

struct P14Entry: Identifiable, Equatable {
    let id = UUID()
    var body: String
    var tags: [P14Tag]
    var syncState: Int = 2
    var completed = false
    var completedAt: Date?
}

struct P14Tag: Identifiable, Equatable {
    let id = UUID()
    let label: String
    let kind: TagKind
}

enum TagKind {
    case project, ai, reminder, normal, attachment
}

struct ContentView: View {
    @State private var entries: [P14Entry] = Self.seed
    @State private var selectedTab = 0
    @State private var showingComposer = false
    @State private var undoEntry: P14Entry?
    @State private var searchText = ""

    var body: some View {
        TabView(selection: $selectedTab) {
            entryList(completed: false)
                .tabItem { Label("收集箱", systemImage: "tray") }
                .tag(0)

            entryList(completed: true)
                .tabItem { Label("已完成", systemImage: "checkmark.circle") }
                .tag(1)
        }
        .tint(.primary)
        .overlay(alignment: .bottomTrailing) {
            if selectedTab == 0 {
                Button {
                    showingComposer = true
                } label: {
                    Image(systemName: "plus")
                        .font(.title2.weight(.semibold))
                        .foregroundStyle(.white)
                        .frame(width: 54, height: 54)
                        .background(.black, in: Circle())
                        .shadow(radius: 8, y: 4)
                }
                .padding(.trailing, 18)
                .padding(.bottom, 66)
                .accessibilityLabel("新建 Entry")
            }
        }
        .overlay(alignment: .bottom) {
            if let undoEntry {
                HStack(spacing: 16) {
                    Text("已完成")
                    Button("撤销") { undoCompletion(undoEntry) }
                        .fontWeight(.semibold)
                }
                .font(.subheadline)
                .foregroundStyle(.white)
                .padding(.horizontal, 16)
                .padding(.vertical, 11)
                .background(.black.opacity(0.9), in: Capsule())
                .padding(.bottom, 74)
                .transition(.move(edge: .bottom).combined(with: .opacity))
            }
        }
        .sheet(isPresented: $showingComposer) {
            ComposerSheet { entry in
                withAnimation(.snappy) {
                    entries.insert(entry, at: 0)
                }
                showingComposer = false
                Task {
                    try? await Task.sleep(for: .seconds(1.8))
                    await MainActor.run {
                        if let index = entries.firstIndex(where: { $0.id == entry.id }) {
                            entries[index].syncState = 2
                        }
                    }
                }
            }
            .presentationDetents([.height(430), .medium])
            .presentationDragIndicator(.visible)
            .presentationBackground(.ultraThinMaterial)
        }
    }

    @ViewBuilder
    private func entryList(completed: Bool) -> some View {
        NavigationStack {
            List {
                ForEach(filteredEntries(completed: completed)) { entry in
                    EntryRow(entry: entry) {
                        toggleCompletion(entry)
                    }
                    .swipeActions(edge: .trailing, allowsFullSwipe: true) {
                        Button(role: .destructive) { } label: {
                            Label("删除", systemImage: "trash")
                        }
                        Button { } label: {
                            Label("置顶", systemImage: "pin")
                        }
                        .tint(.orange)
                    }
                }
            }
            .listStyle(.plain)
            .navigationTitle(completed ? "已完成" : "收集箱")
            .searchable(text: $searchText, placement: .navigationBarDrawer(displayMode: .automatic), prompt: "搜索 Entry、标签、项目")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Menu {
                        Button("同步与连接", systemImage: "arrow.triangle.2.circlepath") { }
                        Button("标签与 AI 建议", systemImage: "sparkles") { }
                        Button("存储空间", systemImage: "internaldrive") { }
                        Button("提醒设置", systemImage: "bell") { }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                    }
                }
            }
        }
    }

    private func filteredEntries(completed: Bool) -> [P14Entry] {
        entries
            .filter { $0.completed == completed }
            .filter { entry in
                searchText.isEmpty || entry.body.localizedCaseInsensitiveContains(searchText) || entry.tags.contains { $0.label.localizedCaseInsensitiveContains(searchText) }
            }
            .sorted { lhs, rhs in
                if completed {
                    return (lhs.completedAt ?? .distantPast) > (rhs.completedAt ?? .distantPast)
                }
                return entries.firstIndex(of: lhs)! < entries.firstIndex(of: rhs)!
            }
    }

    private func toggleCompletion(_ entry: P14Entry) {
        guard let index = entries.firstIndex(where: { $0.id == entry.id }) else { return }
        withAnimation(.snappy) {
            if entries[index].completed {
                entries[index].completed = false
                entries[index].completedAt = nil
            } else {
                entries[index].completed = true
                entries[index].completedAt = Date()
                undoEntry = entries[index]
            }
        }
        if undoEntry != nil {
            Task {
                try? await Task.sleep(for: .seconds(4))
                await MainActor.run {
                    withAnimation { undoEntry = nil }
                }
            }
        }
    }

    private func undoCompletion(_ entry: P14Entry) {
        guard let index = entries.firstIndex(where: { $0.id == entry.id }) else { return }
        withAnimation(.snappy) {
            entries[index].completed = false
            entries[index].completedAt = nil
            undoEntry = nil
        }
    }

    static let seed: [P14Entry] = [
        P14Entry(body: "把 P14 的同步协议接到现有 API Gateway，后端第一版部署在 Mac mini。", tags: [
            .init(label: "✦ P14", kind: .project), .init(label: "产品", kind: .ai), .init(label: "明天 20:00", kind: .reminder), .init(label: "2 段录音", kind: .attachment)
        ]),
        P14Entry(body: "这次在函馆看到海和山连在一起的时候，感觉城市并不需要很大，舒服就够了。", tags: [
            .init(label: "✦ 旅行感悟", kind: .ai), .init(label: "日本", kind: .normal)
        ]),
        P14Entry(body: "检查 USB WAN 拔出以后，P1 是否会正确回到国内出口。", tags: [
            .init(label: "P1", kind: .project), .init(label: "待办", kind: .ai), .init(label: "今天 20:00", kind: .reminder)
        ], syncState: 1)
    ]
}

struct EntryRow: View {
    let entry: P14Entry
    let toggle: () -> Void

    var body: some View {
        HStack(alignment: .top, spacing: 11) {
            Button(action: toggle) {
                Image(systemName: entry.completed ? "checkmark.circle.fill" : "circle")
                    .font(.title3)
                    .foregroundStyle(entry.completed ? Color.accentColor : Color.secondary)
            }
            .buttonStyle(.plain)

            VStack(alignment: .leading, spacing: 8) {
                Text(entry.body)
                    .font(.body)
                    .foregroundStyle(.primary)
                    .fixedSize(horizontal: false, vertical: true)

                FlowTags(tags: entry.tags)
            }

            Spacer(minLength: 4)

            Text(entry.syncState == 2 ? "✓✓" : "✓")
                .font(.caption2.weight(.bold))
                .foregroundStyle(.tertiary)
                .accessibilityLabel(entry.syncState == 2 ? "后端已接收" : "本地已保存")
        }
        .padding(.vertical, 5)
    }
}

struct FlowTags: View {
    let tags: [P14Tag]

    var body: some View {
        HStack(spacing: 6) {
            ForEach(tags.prefix(4)) { tag in
                Text(tag.label)
                    .font(.caption.weight(.medium))
                    .foregroundStyle(foreground(tag.kind))
                    .padding(.horizontal, 7)
                    .padding(.vertical, 4)
                    .background(background(tag.kind), in: RoundedRectangle(cornerRadius: 7))
            }
        }
        .lineLimit(1)
    }

    private func foreground(_ kind: TagKind) -> Color {
        switch kind {
        case .project: return .blue
        case .ai: return .purple
        case .reminder: return .orange
        case .normal, .attachment: return .secondary
        }
    }

    private func background(_ kind: TagKind) -> Color {
        foreground(kind).opacity(0.10)
    }
}

struct ComposerSheet: View {
    enum Phase { case idle, recording, processing, ready }

    @Environment(\.dismiss) private var dismiss
    @State private var text = ""
    @State private var phase: Phase = .idle
    @State private var isPressed = false
    @State private var tags: [P14Tag] = []
    @State private var recordingTask: Task<Void, Never>?

    let onSave: (P14Entry) -> Void

    private let rawChunks = [
        "那个 P14 吧，", "我觉得明天还是要", "把那个同步的问题", "弄一下，", "然后走 API Gateway，", "后端先放 Mac mini。"
    ]

    var body: some View {
        VStack(spacing: 14) {
            ZStack(alignment: .topLeading) {
                RoundedRectangle(cornerRadius: 18)
                    .fill(Color(.secondarySystemBackground))

                if text.isEmpty {
                    Text("写点什么，或者按住说…")
                        .foregroundStyle(.tertiary)
                        .padding(15)
                }

                TextEditor(text: $text)
                    .scrollContentBackground(.hidden)
                    .padding(10)
                    .font(.body)
                    .disabled(phase == .recording || phase == .processing)
                    .opacity(text.isEmpty ? 0.02 : 1)

                if phase == .processing {
                    RoundedRectangle(cornerRadius: 18)
                        .fill(.purple.opacity(0.055))
                        .overlay {
                            VStack(spacing: 9) {
                                Image(systemName: "sparkles")
                                    .font(.title3)
                                Text("正在整理")
                                    .font(.caption.weight(.semibold))
                            }
                            .foregroundStyle(.purple)
                            .symbolEffect(.pulse)
                        }
                        .transition(.opacity)
                }
            }
            .frame(minHeight: 132)
            .animation(.easeInOut(duration: 0.25), value: phase == .processing)

            if !tags.isEmpty {
                HStack(spacing: 6) {
                    ForEach(tags) { tag in
                        Text(tag.label)
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(tag.kind == .project ? Color.blue : tag.kind == .reminder ? Color.orange : Color.purple)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 5)
                            .background((tag.kind == .project ? Color.blue : tag.kind == .reminder ? Color.orange : Color.purple).opacity(0.10), in: RoundedRectangle(cornerRadius: 8))
                            .transition(.scale.combined(with: .opacity))
                    }
                    Spacer()
                }
            }

            HStack(spacing: 12) {
                Button("照片", systemImage: "photo") { }
                    .buttonStyle(.bordered)
                Button("文件", systemImage: "paperclip") { }
                    .buttonStyle(.bordered)

                Spacer()

                if phase == .processing {
                    Label("整理中", systemImage: "sparkles")
                        .font(.caption)
                        .foregroundStyle(.purple)
                }
            }

            HStack(spacing: 14) {
                Image(systemName: phase == .recording ? "waveform" : "waveform.path")
                    .font(.title3)
                    .foregroundStyle(phase == .recording ? .red : .secondary)
                    .symbolEffect(.variableColor.iterative, isActive: phase == .recording)
                    .frame(maxWidth: .infinity, alignment: .trailing)

                Circle()
                    .fill(phase == .recording ? Color.red : Color.black)
                    .frame(width: 68, height: 68)
                    .overlay {
                        Image(systemName: "mic.fill")
                            .font(.title2)
                            .foregroundStyle(.white)
                    }
                    .scaleEffect(isPressed ? 1.12 : 1)
                    .shadow(color: phase == .recording ? .red.opacity(0.25) : .black.opacity(0.16), radius: 12, y: 5)
                    .gesture(
                        DragGesture(minimumDistance: 0)
                            .onChanged { _ in startRecordingIfNeeded() }
                            .onEnded { _ in stopAndProcess() }
                    )
                    .accessibilityLabel("按住说")

                Text(phase == .recording ? "松开结束" : "按住说")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }

            HStack {
                Button("取消") { dismiss() }
                    .foregroundStyle(.secondary)
                Spacer()
                Button("保存") {
                    onSave(P14Entry(body: text, tags: tags, syncState: 1))
                }
                .buttonStyle(.borderedProminent)
                .tint(.black)
                .disabled(text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || phase == .recording || phase == .processing)
            }
        }
        .padding(.horizontal, 18)
        .padding(.bottom, 12)
    }

    private func startRecordingIfNeeded() {
        guard phase != .recording else { return }
        recordingTask?.cancel()
        isPressed = true
        phase = .recording
        text = ""
        tags = []

        recordingTask = Task {
            for chunk in rawChunks {
                if Task.isCancelled { return }
                try? await Task.sleep(for: .milliseconds(360))
                if Task.isCancelled { return }
                await MainActor.run {
                    text += chunk
                }
            }
        }
    }

    private func stopAndProcess() {
        guard phase == .recording else { return }
        recordingTask?.cancel()
        isPressed = false
        withAnimation(.easeInOut(duration: 0.2)) {
            phase = .processing
        }

        Task {
            try? await Task.sleep(for: .milliseconds(1150))
            await MainActor.run {
                withAnimation(.easeInOut(duration: 0.34)) {
                    text = "明天处理 P14 同步问题，通过 API Gateway 同步到 Mac mini 后端。"
                }
            }
            try? await Task.sleep(for: .milliseconds(220))
            await MainActor.run {
                withAnimation(.snappy) {
                    tags = [
                        .init(label: "✦ P14", kind: .project),
                        .init(label: "待办", kind: .ai),
                        .init(label: "明天 20:00", kind: .reminder),
                        .init(label: "1 段录音", kind: .attachment)
                    ]
                    phase = .ready
                }
            }
        }
    }
}
