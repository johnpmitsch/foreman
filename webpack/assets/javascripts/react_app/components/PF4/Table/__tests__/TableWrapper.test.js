import React from 'react';
import { renderWithRedux, patientlyWaitFor, fireEvent } from '../../../../../../../react-testing-lib-wrapper.js';
import TableWrapper from "../TableWrapper";


const SandwichTable = () => {
  const fakeMetadata = { total: 3, subtotal: 3, page: 1, per_page: 20, search: "" };
  const sandwiches = [
    { bread: 'rye', protein: 'pastrami', cheese: 'swiss' },
    { bread: 'wheat', protein: 'ham', cheese: 'american' },
    { bread: 'focaccia', protein: 'tofu', cheese: 'havarti' },
  ]

  // Handling state for table, API response, search, and metadata
  const [rows, setRows] = useState([]);
  const [response, setResponse] = useState({ results: [] });
  const [metadata, setMetadata] = useState({});
  const [searchQuery, updateSearchQuery] = useState('');
  const [status, setStatus] = useState(STATUS.PENDING);
  const columnHeaders = [ __('bread'), __('protein'), __('cheese') ];
  const emptyContentTitle = __("You currently don't have any sandwiches");
  const emptyContentBody = __('Please add some sandwiches.'); // needs link
  const emptySearchTitle = __('No matching sandwiches found');
  const emptySearchBody = __('Try changing your search settings.')

  // Listen for API response and build rows according to patternfly 4 format
  useEffect(() => {
    const newRows = response.results.map(sandwich => {
      const { bread, protein, cheese } = sandwich;
      return { cells: [bread, protein, cheese] };
    })
    setRows(newRows);
  }, [response])
}

test('Can call API and display rows on page load', async (done) => {
  const { queryByText } = renderWithRedux(<TableWrapper
    {...{
      rows,
      metadata,
      emptyContentTitle,
      emptyContentBody,
      emptySearchTitle,
      emptySearchBody,
      searchQuery,
      updateSearchQuery,
      status,
    }}
    cells={columnHeaders}
    variant={TableVariant.compact}
    autocompleteEndpoint="/sandwiches/auto_complete_search"
    fetchItems={params => sandwichApiCall(params)}
  />, {});
});