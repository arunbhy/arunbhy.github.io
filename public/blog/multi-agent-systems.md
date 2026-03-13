Single-prompt LLM calls hit a ceiling fast. When your task involves research, planning, execution, and validation — a single agent trying to do everything produces mediocre results. Multi-agent systems break complex tasks into specialized roles, each handled by a focused agent.

## Why Multiple Agents?

Consider a travel planning system. A single LLM call might produce a generic itinerary. But a well-designed multi-agent system can:

1. **Research Agent** — searches flights, hotels, activities
2. **Planning Agent** — optimizes the itinerary for preferences and constraints
3. **Booking Agent** — handles reservations via API calls
4. **Validation Agent** — checks for conflicts, budget overruns, impossible timings

Each agent has a narrow scope, specific tools, and clear success criteria. The result is dramatically better than asking one agent to do everything.

## Architecture Patterns

### Pattern 1: Sequential Pipeline

Agents execute in a fixed order, each building on the previous output.

```python
class Pipeline:
    def __init__(self, agents):
        self.agents = agents

    def run(self, initial_input):
        result = initial_input
        for agent in self.agents:
            result = agent.execute(result)
        return result

pipeline = Pipeline([
    ResearchAgent(),
    PlanningAgent(),
    ValidationAgent()
])
```

**Best for:** Linear workflows where each step has clear inputs/outputs.

### Pattern 2: Orchestrator-Worker

A central orchestrator decomposes the task and delegates to specialized workers.

```python
class Orchestrator:
    def __init__(self, workers):
        self.workers = workers
        self.llm = ChatModel()

    def run(self, task):
        # Decompose task into subtasks
        plan = self.llm.generate(
            f"Break this task into subtasks for these workers: "
            f"{[w.name for w in self.workers]}\n\nTask: {task}"
        )

        results = {}
        for subtask in plan.subtasks:
            worker = self.select_worker(subtask)
            results[subtask.id] = worker.execute(subtask)

        # Synthesize results
        return self.llm.generate(
            f"Combine these results into a final answer: {results}"
        )
```

**Best for:** Complex tasks where subtask decomposition isn't predictable.

### Pattern 3: Debate / Critique

Multiple agents propose solutions, then critique each other's work.

```python
class DebateSystem:
    def run(self, problem):
        # Phase 1: Independent proposals
        proposals = [agent.propose(problem) for agent in self.agents]

        # Phase 2: Cross-critique
        critiques = []
        for i, agent in enumerate(self.agents):
            others = [p for j, p in enumerate(proposals) if j != i]
            critiques.append(agent.critique(proposals[i], others))

        # Phase 3: Synthesis
        return self.synthesizer.merge(proposals, critiques)
```

**Best for:** Tasks where correctness matters more than speed (code review, research analysis).

## Communication Between Agents

The hardest part isn't building individual agents — it's getting them to communicate effectively.

### Shared State

All agents read/write to a common state object:

```python
class SharedState:
    def __init__(self):
        self.data = {}
        self.history = []

    def update(self, agent_name, key, value):
        self.data[key] = value
        self.history.append({
            "agent": agent_name,
            "action": "update",
            "key": key,
            "timestamp": time.time()
        })
```

### Message Passing

Agents communicate through structured messages:

```python
@dataclass
class AgentMessage:
    sender: str
    receiver: str
    content: dict
    message_type: str  # "request", "response", "error"

class MessageBus:
    def __init__(self):
        self.queues = defaultdict(deque)

    def send(self, message: AgentMessage):
        self.queues[message.receiver].append(message)

    def receive(self, agent_name: str):
        return self.queues[agent_name].popleft()
```

## Practical Lessons

**Start with two agents, not ten.** The complexity of coordination grows quadratically. Start with a planner and an executor, and only add agents when you have clear evidence that specialization helps.

**Give agents explicit personas.** "You are a meticulous code reviewer who focuses on security vulnerabilities" produces better results than "Review this code." The persona constrains the agent's attention.

**Implement timeouts and fallbacks.** Agents can get stuck in loops, especially in debate patterns. Always set maximum iterations and have a fallback path.

**Log everything.** Multi-agent debugging is hard. Log every inter-agent message, every tool call, and every LLM response. You'll need it when things go wrong.

**Cost adds up fast.** Each agent makes LLM calls. A 4-agent system processing 100 requests can easily burn through $50-100/day in API costs. Monitor token usage per agent and optimize prompts aggressively.

## When to Use Multi-Agent Systems

**Good fit:**
- Tasks requiring multiple distinct skills or tools
- Workflows where quality improves with self-critique
- Systems that need to handle diverse, unpredictable requests

**Overkill:**
- Simple Q&A or summarization
- Tasks with a single clear step
- Latency-sensitive applications (each agent adds 2-5 seconds)

The best multi-agent systems feel like well-run teams — each member has a clear role, communication is structured, and there's always someone checking the work.

---

*Further reading: [AutoGen](https://microsoft.github.io/autogen/), [CrewAI](https://www.crewai.com/), [LangGraph](https://langchain-ai.github.io/langgraph/)*