const initialIssues = [
    {
        id: 1,
        status: 'New',
        owner: 'Abdullah',
        effort: 5,
        created: new Date('2020-01-04'),
        due: undefined,
        title: 'Error in console when clicking Add'
    },
    {
        id: 2,
        status: 'Assigned',
        owner: 'Asad',
        effort: 14,
        created: new Date('2019-11-12'),
        due: new Date('2020-01-01'),
        title: 'Missing bottom border on panel'
    }
];

const sampleIssue = {
    status: 'New',
    owner: 'John',
    title: 'Completion data should be optional'
};


class IssueFilter extends React.Component {
    render() {
        return (
            <div>This is a placeholder for the issue filter</div>
        );
    }
}

class IssueRow extends React.Component {
    render() {
        const issue = this.props.issue;
        return (
            <tr>
                <td>{issue.id}</td>
                <td>{issue.status}</td>
                <td>{issue.owner}</td>
                <td>{issue.effort}</td>
                <td>{issue.created.toDateString()}</td>
                <td>{this.props.issue.due ? this.props.issue.due.toDateString() : ""}</td>
                <td>{issue.title}</td>
            </tr>
        );
    }
}

class IssueTable extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] };
        setTimeout(() => this.createIssue(sampleIssue), 2000);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        setTimeout(() => {
            this.setState({ issues: initialIssues });
        }, 500);
    }

    createIssue(issue) {
        issue.id = this.state.issues.length + 1;
        issue.created = new Date();

        const newIssuesList = this.state.issues.slice();
        newIssuesList.push(issue);
        this.setState({ issues: newIssuesList });
    }

    render() {
        const issueRows = this.state.issues.map(issue => <IssueRow key={issue.id} issue={issue} />);

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
}

class IssueAdd extends React.Component {
    render() {
        return (
            <div>This is a placeholder for a form to add an issue</div>
        );
    }
}

class IssueList extends React.Component {

    render() {
        return (
            <>
                <h1>Issue Tracker</h1>
                <IssueFilter />
                <hr />
                <IssueTable />
                <hr />
                <IssueAdd />
            </>
        );
    }
}

const element = <IssueList />;
ReactDOM.render(element, document.getElementById('content'));
