import React, { Component } from 'react';
import api from '../../services/api';
import PropTypes from 'prop-types';

// import { Container } from './styles';
import Container from '../../components/Container';
import { Loading } from './styles';

export default class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };
  state = {
    repository: {},
    issues: [],
    loading: true,
  };

  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    // serao realizadas as duas chamadas ao mesmo tempo
    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5, // a proxima etapa so sera realizada se as duas chamadas acima forem realizadas
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  render() {
    const { repository, issues, loading } = this.state;
    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return <Container>Repository</Container>;
  }
}
