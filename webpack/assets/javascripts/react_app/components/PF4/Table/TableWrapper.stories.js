import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { TableVariant } from '@patternfly/react-table';
import TableWrapper from './TableWrapper';
import ContextFeatures from '../../Pagination/Context.fixtures';
import { getForemanContext } from '../../../Root/Context/ForemanContext';
import { STATUS } from '../../../constants';
import Story from '../../../../../../stories/components/Story';
import store from '../../../redux';

const ForemanContext = getForemanContext();

export default {
  title: 'Components|PF4/TableWrapper',
  decorators: [
    StoryFn => (
      <ForemanContext.Provider value={ContextFeatures}>
        <StoryFn />
      </ForemanContext.Provider>
    ),
  ],
};

export const defaultStory = () => {
  const fakeMetadata = { total: 3, subtotal: 3, page: 1, per_page: 20, search: "" };
  const sandwiches = [
    { bread: 'rye', protein: 'pastrami', cheese: 'swiss' },
    { bread: 'wheat', protein: 'ham', cheese: 'american' },
    { bread: 'focaccia', protein: 'tofu', cheese: 'havarti' },
  ]

  // Typically handled by API middleware
  const sandwichApiCall = (params = {}) => {
    setStatus(STATUS.PENDING);
    setTimeout(() => {
      setStatus(STATUS.RESOLVED);
      setMetadata({ fakeMetadata, ...params })
      setResponse({ results: sandwiches })
    }, 3000)
  }

  // Handling state for table, API response, search, and metadata
  const [rows, setRows] = useState([]);
  const [response, setResponse] = useState({ results: [] });
  const [metadata, setMetadata] = useState({});
  const [searchQuery, updateSearchQuery] = useState('');
  const [status, setStatus] = useState(STATUS.PENDING);

  // Listen for API response and build rows according to patternfly 4 format
  useEffect(() => {
    const newRows = response.results.map(sandwich => {
      const { bread, protein, cheese } = sandwich;
      return { cells: [bread, protein, cheese] };
    })
    setRows(newRows);
  }, [response])

  // Patternfly 4 column/cell header format
  const columnHeaders = [ __('bread'), __('protein'), __('cheese') ];

  // Empty content messages
  const emptyContentTitle = __("You currently don't have any sandwiches");
  const emptyContentBody = __('Please add some sandwiches.'); // needs link
  const emptySearchTitle = __('No matching sandwiches found');
  const emptySearchBody = __('Try changing your search settings.');

  return (
    <Provider store={store}>
      <Story>
        <TableWrapper
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
        />
      </Story>
    </Provider>
  );
}