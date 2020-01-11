import URLSearchParams from 'url-search-params';

import React from 'react';
import { Route } from 'react-router-dom';

import graphQLFetch from './graphqlFetch.js';
import IssueFilter from './issueFilter.jsx';
import IssueTable from './issueTable.jsx';
import IssueAdd from './issueAdd.jsx';
import IssueDetail from './issueDetail.jsx';


export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] };
        this.createIssue = this.createIssue.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate(prevProps) {
        const { location: { search: prevSearch } } = prevProps;
        const { location: { search } } = this.props;
        if (prevSearch !== search) {
            this.loadData();
        }
    }

    async loadData() {
        const query = `query issues($status: StatusType) {
            issues(status: $status) {
                _id id title status owner effort created due
            }
        }`;

        const { location: { search } } = this.props;
        const params = new URLSearchParams(search);
        const vars = {};

        if (params.get('status')) vars.status = params.get('status');

        const data = await graphQLFetch(query, vars);
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
        const { match } = this.props;
        return (
            <>
                <h1>Issue Tracker</h1>
                <IssueFilter />
                <hr />
                <IssueTable issues={issues} />
                <hr />
                <IssueAdd createIssue={this.createIssue} />
                <hr />
                <Route path={`${match.path}/:id`} component={IssueDetail} />
            </>
        );
    }
}
