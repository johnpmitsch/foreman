import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { TableVariant } from '@patternfly/react-table';
import TableWrapper from './TableWrapper';
import ContextFeatures from '../../Pagination/Context.fixtures';
import { getForemanContext } from '../../../Root/Context/ForemanContext';
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
  const [rows, setRows] = useState([]);
  const [metadata, setMetadata] = useState({ total: 3, page: 1, perPage: 20, search: "" });
  const [searchQuery, updateSearchQuery] = useState('');

  // Patternfly 4 column/cell header format
  const columnHeaders = [ __('bread'), __('protein'), __('cheese') ];
  const fooApiCall = () => {
    setTimeout(() => {
      setRows(
        // Patternfly 4 Table row format
        [{ title: 'rye' }, { title: 'pastrami' }, { title: 'swiss' }],
        [{ title: 'wheat' }, { title: 'ham' }, { title: 'cheese' }],
        [{ title: 'focaccia' }, { title: 'tofu' }, { title: 'havarti' }],
      )
    }, 2000)
  }

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
          autocompleteEndpoint="/foo/auto_complete_search"
          fetchItems={params => fooApiCall(params)}
        />
      </Story>
    </Provider>
  );
}