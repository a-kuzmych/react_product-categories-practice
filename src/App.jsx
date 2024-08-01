import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

export const App = () => {
  const [allUsers] = useState(usersFromServer);
  const [allProducts] = useState(productsFromServer);
  const [allCategories] = useState(categoriesFromServer);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [selectedUser, setSelectedUser] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categoryMap = Object.fromEntries(
    allCategories.map(category => [
      category.id,
      { title: category.title, icon: category.icon },
    ]),
  );

  const userMap = Object.fromEntries(
    allUsers.map(user => [user.id, user.name]),
  );

  const userGenderMap = Object.fromEntries(
    allUsers.map(user => [user.id, user.sex]),
  );

  const handleFilterChange = userName => {
    setSelectedUser(userName);
    filterProducts(selectedCategory, userName);
  };

  const handleCategoryChange = categoryId => {
    setSelectedCategory(categoryId);
    filterProducts(categoryId, selectedUser);
  };

  const filterProducts = (categoryId, userName) => {
    let filtered = allProducts;

    if (userName !== 'All') {
      const user = allUsers.find(user => user.name === userName);

      if (user) {
        const userCategories = allCategories
          .filter(category => category.ownerId === user.id)
          .map(category => category.id);

        filtered = filtered.filter(product =>
          userCategories.includes(product.categoryId),
        );
      }
    }

    if (categoryId !== 'All') {
      filtered = filtered.filter(
        product => product.categoryId === parseInt(categoryId, 10),
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={selectedUser === 'All' ? 'is-active' : ''}
                onClick={() => handleFilterChange('All')}
              >
                All
              </a>
              {allUsers.map(user => (
                <a
                  key={user}
                  data-cy="FilterUser"
                  href="#/"
                  className={selectedUser === user.name ? 'is-active' : ''}
                  onClick={() => handleFilterChange(user.name)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value=""
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={`button is-success mr-6 is-outlined ${selectedCategory === 'All' ? 'is-active' : ''}`}
                onClick={() => handleCategoryChange('All')}
              >
                All
              </a>
              {allCategories.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  href="#/"
                  className={`button mr-2 my-1 ${selectedCategory === category.id.toString() ? 'is-active' : 'is-info'}`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.icon} {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setSelectedUser('All');
                  setSelectedCategory('All');
                  setFilteredProducts(allProducts);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            {filteredProducts.length === 0
              ? 'No products matching selected criteria'
              : ''}
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map(product => {
                const category = categoryMap[product.categoryId];
                const ownerId = allCategories.find(
                  cat => cat.id === product.categoryId,
                )?.ownerId;
                const ownerName = userMap[ownerId] || '';
                const ownerGender = userGenderMap[ownerId] || 'm';

                return (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">
                      {category ? `${category.icon} - ${category.title}` : ''}
                    </td>
                    <td
                      data-cy="ProductUser"
                      className={
                        ownerGender === 'm'
                          ? 'has-text-link'
                          : 'has-text-danger'
                      }
                    >
                      {ownerName}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
