class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] };
        this.createIssue = this.createIssue.bind(this)
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        return (
            <>
                <h1>Issue Tracker</h1>
                <IssueFilter />
                <hr />
                <IssueTable issues={this.state.issues} />
                <hr />
                <IssueAdd createIssue={this.createIssue} />
            </>
        );
    }

    async loadData() {
        const query = `query {
            issues {
                id title status owner effort created due
            }
        }`;

        const response = await fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        const body = await response.text();
        const result = JSON.parse(body, jsonDateReviver);
        this.setState({ issues: result.data.issues });
    }

    createIssue(issue) {
        issue.id = this.state.issues.length + 1;
        issue.created = new Date();

        const newIssuesList = this.state.issues.slice();
        newIssuesList.push(issue);
        this.setState({ issues: newIssuesList });
    }
}

class IssueAdd extends React.Component {
    constructor() {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <form name="issueAdd" onSubmit={this.handleSubmit}>
                <input type="text" name="owner" placeholder="Owner" />
                <input type="text" name="title" placeholder="Title" />
                <button>Add</button>
            </form>
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = document.forms.issueAdd;
        const issue = {
            owner: form.owner.value,
            title: form.title.value,
            status: 'New'
        };

        this.props.createIssue(issue);
        form.owner.value = '';
        form.title.value = '';
    }
}

class IssueFilter extends React.Component {
    render() {
        return (
            <div>This is a placeholder for the issue filter</div>
        );
    }
}

function IssueTable(props) {
    const issueRows = props.issues.map(issue => <IssueRow key={issue.id} issue={issue} />);
    return (
        <table className="bordered-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Status</th>
                    <th>Owner</th>
                    <th>Effort</th>
                    <th>Created</th>
                    <th>Due</th>
                    <th>Title</th>
                </tr>
            </thead>
            <tbody>
                {issueRows}
            </tbody>
        </table>
    );
}

function IssueRow(props) {
    const issue = props.issue;
    return (
        <tr>
            <td>{issue.id}</td>
            <td>{issue.status}</td>
            <td>{issue.owner}</td>
            <td>{issue.effort}</td>
            <td>{issue.created.toDateString()}</td>
            <td>{issue.due ? issue.due.toDateString() : ''}</td>
            <td>{issue.title}</td>
        </tr>
    );
}

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');
function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
}

const element = <IssueList />;
ReactDOM.render(element, document.getElementById('content'));
