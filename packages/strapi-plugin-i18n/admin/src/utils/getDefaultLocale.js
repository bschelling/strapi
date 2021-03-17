const hasLocalePermission = (permissions, localeCode) => {
  if (permissions) {
    const hasPermission = permissions.some(permission =>
      permission.properties.locales.includes(localeCode)
    );

    if (hasPermission) {
      return true;
    }
  }

  return false;
};

const getFirstLocale = permissions => {
  if (permissions.length > 0) {
    const firstAuthorizedNonDefaultLocale = permissions[0].properties.locales[0];

    if (firstAuthorizedNonDefaultLocale) {
      return firstAuthorizedNonDefaultLocale;
    }
  }

  return null;
};

/**
 * Entry point of the module
 */
const getDefaultLocale = (ctPermissions, locales = []) => {
  const defaultLocale = locales.find(locale => locale.isDefault);

  if (!defaultLocale) {
    return null;
  }

  const readPermissions = ctPermissions['plugins::content-manager.explorer.read'];
  const createPermissions = ctPermissions['plugins::content-manager.explorer.create'];

  if (hasLocalePermission(readPermissions, defaultLocale.code)) {
    return defaultLocale.code;
  }

  if (hasLocalePermission(createPermissions, defaultLocale.code)) {
    return defaultLocale.code;
  }

  // When the default locale is not authorized, we return the first authorized locale
  const firstAuthorizedForReadNonDefaultLocale = getFirstLocale(readPermissions);

  if (firstAuthorizedForReadNonDefaultLocale) {
    return firstAuthorizedForReadNonDefaultLocale;
  }

  return getFirstLocale(createPermissions);
};

export default getDefaultLocale;
