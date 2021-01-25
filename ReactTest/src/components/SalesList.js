import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import axios from 'axios';
import * as Constants from './constants';

const queryClient = new QueryClient()

export default function SalesList(props) {
    if (!props.prodid)
        return "Nincs cikk kiválasztva";

    return (
        <QueryClientProvider client={queryClient}>
            <FetchData prodid={props.prodid} minTimeMs= {props.minTimeMs} maxTimeMs= {props.maxTimeMs}/>
        </QueryClientProvider>
    )
}

function FetchData(props) {
    const { isLoading, error, data } = useQuery("Sales" + props.prodid, () => {

        const source = axios.CancelToken.source();

        const promise = axios.get(Constants.ApiBaseUrl + "/api/Sales"
            , { params: { productid: props.prodid, minTimeMs: props.minTimeMs, maxTimeMs: props.maxTimeMs }, cancelToken: source.token, }
            , { timeout: 5000 }
        );
        promise.cancel = () => {
            source.cancel('Query was cancelled by React Query');
        }
        return promise;

    });

    if (isLoading) return 'Fogyás adat betöltése...';

    if (error) return 'An error has occurred: ' + error.message;
    return RenderData(data.data)
}

function RenderData(data) {
    var sales = [{ month: "", quantity: 0 }, { month: "", quantity: 0 }, { month: "", quantity: 0 }];
    if (data)
        sales = data;


    return (
        <div>
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Hónap</th>
                        <th>Fogyás</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sales.map(function (currentSale, i) {
                            return (
                                <tr key={i}>
                                    <td>{currentSale.month}</td>
                                    <td>{currentSale.quantity}</td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}