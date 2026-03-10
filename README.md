This is the set up an agent to get my information at night for the next day to put on my calendar and then to meet in the morning if any changes happen or if there's any fires we need to put out the need to get addressed by agents or if you guys can help in anyway there should be quick but the nightly one will get the calendar set up for the following day and make sure that all messages emails and previous chats during the week are gone through to make sure that we're following up with all the clients

## Briefs

### Brian's Calendar Quick Questions

A multiple-choice quick question brief located at [`briefs/brian-calendar-quick-questions.json`](briefs/brian-calendar-quick-questions.json). This brief is used to:

1. **Ask Brian which projects need to be on the calendar** — presents a multiple-choice list of projects so Brian can quickly select which ones should be scheduled.
2. **Capture when and roughly what time** — for each selected project, asks Brian when it should be scheduled (today, this week, next week, etc.) and what time of day works best.
3. **Show agent task statuses** — displays the current tasks across all working agents (Calendar, Email, Project Tracking, Client Relations, Urgent Issues) along with their statuses (active, in-progress, pending, idle) so Brian can assess what's being worked on.

#### How It Works

The brief is structured as a JSON questionnaire with five questions that guide Brian through calendar planning. After the questions, the `agentTaskStatuses` section provides a dashboard view of all agent tasks and their current statuses, giving Brian full visibility into what each agent is working on.
