module Pageflow
  # Apply account wide customizations to themes of a specific entry
  # type.
  #
  # @since edge
  class ThemeCustomizations
    # Override theme options and files for entries of an entry type in
    # a specific account.
    def update(account:, entry_type_name:, overrides: {}, file_ids: {})
      ThemeCustomization
        .find_or_initialize_by(account: account, entry_type_name: entry_type_name)
        .update!(overrides: overrides, selected_file_ids: file_ids)
    end

    # Get customization for entry type and account.
    #
    # @return [ThemeCustomization]
    def get(account:, entry_type_name:)
      ThemeCustomization
        .find_or_initialize_by(account: account, entry_type_name: entry_type_name)
    end

    # Upload a file that shall be used to customize a theme. Uploading
    # the file does not result in visible changes. Call [#update] and
    # assign a role via the `file_ids` parameter.
    #
    # @return [ThemeCustomizationFile]
    def upload_file(account:, entry_type_name:, type_name:, attachment:)
      theme_customization_file =
        ThemeCustomization
        .find_or_create_by(account: account, entry_type_name: entry_type_name)
        .uploaded_files
        .build(type_name: type_name)

      # Assign attachment in separate step to make sure theme
      # customization association (which is used to look up Paperclip
      # styles and validation content type) has already been set when Paperclip runs.
      theme_customization_file.attachment = attachment
      theme_customization_file.save!
      theme_customization_file
    end
  end
end
