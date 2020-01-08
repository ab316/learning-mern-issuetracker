/* globals React */

import graphQLFetch from './graphqlFetch.js';
import IssueFilter from './issueFilter.jsx';
import IssueTable from './issueTable.jsx';
import IssueAdd from './issueAdd.jsx';


export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] };
        this.createIssue = this.createIssue.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        const query = `query {
            issues {
                _id id title status owner effort created due
            }
        }`;

        const data = await graphQLFetch(query);
        if (data) {
            this.setState({ issues: data.issues });
        }
    }

    async createIssue(issue) {
        const query = `mutation addIssue($issue: IssueInput!) {
            addIssue(issue: $issue) {
                id
            }
        }`;

        const data = await graphQLFetch(query, { issue });
        if (data) {
            this.loadData();
        }
    }

    render() {
        const { issues } = this.state;
        return (
            <>
                <h1>Issue Tracker</h1>
                <IssueFilter />
                <hr />
                <IssueTable issues={issues} />
                <hr />
                <IssueAdd createIssue={this.createIssue} />
            </>
        );
    }
}
