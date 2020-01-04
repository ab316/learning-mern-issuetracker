class IssueFilter extends React.Component {
    render() {
        return (
            <div>This is a placeholder for the issue filter</div>
        )
    }
}

class IssueTable extends React.Component {
    render() {
        return (
            <div>This is a placeholder for the table of issues</div>
        )
    }
}

class IssueAdd extends React.Component {
    render() {
        return (
            <div>This is a placeholder for a form to add an issue</div>
        )
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
