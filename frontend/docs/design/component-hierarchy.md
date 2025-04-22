# Component Hierarchy

This document outlines the component hierarchy and organization for the Behavior Coach application, showing the relationship between components and how they're nested.

## Layout Components

```
<RootLayout>
  ├── <AuthLayout> (for unauthenticated pages)
  │   └── {children} (Login, Register, Password Reset, etc.)
  │
  └── <AppLayout> (for authenticated pages)
      ├── <Header>
      │   ├── <Logo>
      │   ├── <MainNav>
      │   └── <UserMenu>
      │       ├── <Notifications>
      │       └── <ProfileDropdown>
      │
      ├── <Sidebar>
      │   ├── <OrganizationInfo>
      │   └── <SidebarNav>
      │
      ├── <MainContent>
      │   └── {children} (page-specific content)
      │
      └── <Footer>
```

## Page-Specific Components

### Organization Pages

```
<OrganizationProfilePage>
  ├── <OrganizationHeader>
  │   ├── <OrganizationLogo>
  │   ├── <OrganizationTitle>
  │   └── <OrganizationActions>
  │
  ├── <TabNavigation>
  │
  └── <TabContent>
      ├── <OverviewTab>
      │   ├── <InfoCard>
      │   └── <StatisticsSection>
      │
      ├── <MembersTab>
      │   ├── <UserTable>
      │   └── <InviteMemberButton>
      │
      ├── <SettingsTab>
      │   └── {Various setting forms}
      │
      └── <ActivityTab>
          └── <ActivityTimeline>
```

### User Management Pages

```
<UserManagementPage>
  ├── <FilterBar>
  │   ├── <SearchInput>
  │   ├── <FilterDropdown>
  │   └── <AddUserButton>
  │
  └── <UserTable>
      ├── <TableHeader>
      ├── <UserTableRow> (multiple)
      └── <Pagination>

<UserProfilePage>
  ├── <UserHeader>
  │   ├── <UserAvatar>
  │   ├── <UserInfo>
  │   └── <UserActions>
  │
  ├── <TabNavigation>
  │
  └── <TabContent>
      ├── <PersonalDetailsTab>
      │   └── <ProfileForm>
      │
      ├── <WorkspaceTab>
      │   └── <PreferencesForm>
      │
      ├── <ActivityTab>
      │   └── <ActivityTimeline>
      │
      └── <SecurityTab>
          └── <SecuritySettings>
```

## Reusable UI Components

### Data Display Components

```
<Card>
<Table>
  ├── <TableHeader>
  ├── <TableRow>
  └── <TableCell>
<Badge>
<StatusIndicator>
<EmptyState>
<Avatar>
<Tabs>
<Timeline>
<Chart> (various types)
<Stat>
<ProgressBar>
<Tooltip>
```

### Form Components

```
<Form>
  ├── <FormSection>
  ├── <FormField>
  │   ├── <Label>
  │   ├── <Input> / <Select> / <Checkbox> / etc.
  │   └── <FormError>
  │
  └── <FormActions>
      ├── <Button>
      └── <Button>

<SearchInput>
<Combobox>
<MultiSelect>
<DatePicker>
<FileUpload>
<RadioGroup>
<Switch>
<Slider>
<ColorPicker>
```

### Feedback Components

```
<Alert>
<Toast>
<Modal>
  ├── <ModalHeader>
  ├── <ModalBody>
  └── <ModalFooter>
<Drawer>
<Popover>
<ConfirmDialog>
<Skeleton>
<Spinner>
```

### Navigation Components

```
<Breadcrumb>
<Pagination>
<DropdownMenu>
<CommandMenu>
<Stepper>
<TabNavigation>
<Sidebar>
<Navbar>
```

## Context Providers and Hooks

```
<AuthProvider>
<OrganizationProvider>
<ThemeProvider>
<NotificationProvider>
<QueryClientProvider>

// Hooks
useAuth()
useOrganization()
useTheme()
useNotifications()
useMediaQuery()
useForm()
```

This component hierarchy establishes a consistent pattern for organizing components and ensures reusability throughout the application. 