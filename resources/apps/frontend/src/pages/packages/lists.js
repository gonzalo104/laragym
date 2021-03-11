import React from 'react';
import {Card, CardBody, CardHeader} from 'reactstrap';
import {Link} from 'react-router-dom';
import {Table} from 'components/Table';
import TableActions from 'components/Table/TableActions';
import Confirm from 'components/Dialogs/Confirm';
import Loader from 'components/Loader';
import CardActions from './actions';
import queryFilters from 'utils/query-filters';
import notify from 'utils/notify';
import date from 'utils/date';
import getErrorMessage from 'utils/getErrorMessage';
import {loadPackages, destroyPackage} from 'requests/packages';
import Pagination from 'components/Pagination/PaginationWithFilter';
import Status from 'components/Badges/Status';

class Component extends React.Component {
  _isMounted = false;

  state = {
    data: [],
    meta: {},
    isLoading: false,
  };

  componentDidMount() {
    this._isMounted = true;
    this.load();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location.search !== this.props.location.search) {
      this.load();
    }
  }

  load = async () => {
    try {
      this.setState({isLoading: true});

      const {data, meta} = await loadPackages(queryFilters());

      if (!this._isMounted) return;

      this.setState({
        data,
        meta,
        isLoading: false,
      });
    } catch (err) {
      this.setState({isLoading: false}, () => {
        notify({
          type: 'error',
          text: getErrorMessage(err),
        });
      });
    }
  };

  get loader() {
    return this.state.isLoading && <Loader show />;
  }

  get headers() {
    return [
      'ID',
      'Nombre',
      'Ciclo de Facturación',
      'Servicio',
      'Cantidad',
      'Estatus',
      'Actualizado',
      'Acciones',
    ];
  }

  getTableActions() {}

  onConfirm = ({payload, type}) => {
    if (type === 'delete') return destroyPackage(payload.id);
  };

  getTableActions = payload => {
    let actions = [{label: 'Editar', href: `/packages/${payload.id}/edit`}];

    if (payload.status !== 'deleted') {
      actions.push({
        label: 'Eliminar',
        type: 'delete',
        color: 'text-danger',
      });
    }

    return actions;
  };

  onClickAction = data => {
    if (data.type === 'delete') {
      this.confirm.open({
        isOpen: true,
        title: 'Eliminar',
        content: '¿Estás seguro de eliminar el registro?',
        payload: data,
      });
      return;
    }
  };

  renderItem = item => {
    return (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td>
          <Link to={`/packages/${item.id}`}>
            {item.name || 'No disponible'}
          </Link>
        </td>
        <td>
          <Link to={`/billing-cycles/${item.cycle.id}`}>
            {item.cycle.name || 'No disponible'}
          </Link>
        </td>
        <td>
          <Link to={`/services/${item.service.id}`}>
            {item.service.name || 'No disponible'}
          </Link>
        </td>
        <td>{item.amount}</td>
        <td className="align-center text-center">
          <Status value={item.status} />
        </td>
        <td>{date(item.updated_at)}</td>
        <td>
          <div className="d-flex justify-content-center">
            <TableActions
              buttonLabel="Accciones"
              payload={item}
              items={this.getTableActions(item)}
              onClick={this.onClickAction}
            />
          </div>
        </td>
      </tr>
    );
  };

  render() {
    return (
      <Card>
        <CardHeader>Administrar Paquetes</CardHeader>
        <CardActions isLoading={this.state.isLoading} />
        <CardBody className="position-relative">
          {this.loader}
          <Table headers={this.headers}>
            {this.state.data.map(item => {
              return this.renderItem(item);
            })}
          </Table>

          {!this.state.isLoading && <Pagination meta={this.state.meta} />}

          <Confirm
            ref={confirm => (this.confirm = confirm)}
            onSubmit={this.onConfirm}
            onAfterSubmit={this.load}
          />
        </CardBody>
      </Card>
    );
  }
}

export default Component;
