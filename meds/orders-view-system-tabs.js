// Inlined in index.html (<script type="text/babel">) — keep in sync when editing.
const { useState } = React;

// System Tabs (same API/styling as components/navigation/tabs.html)
const SystemTabs = ({
    tabs,
    activeTab,
    onChange,
    variant = 'underline',
    fullWidth = false,
}) => {
    const activeColor = 'var(--kipu-color-blue-500, #1565C0)';
    const inactiveColor = '#64748b';
    const containerBorder = '#e2e8f0';

    const containerStyles = {
        display: 'flex',
        borderBottom: variant === 'underline' ? `2px solid ${containerBorder}` : 'none',
        background: variant === 'pills' ? '#f1f5f9' : 'transparent',
        borderRadius: variant === 'pills' ? '8px' : 0,
        padding: variant === 'pills' ? '4px' : 0,
        gap: variant === 'pills' ? '4px' : 0,
    };

    const getTabStyles = (isActive) => {
        const baseStyles = {
            padding: variant === 'pills' ? '10px 20px' : '12px 24px',
            fontSize: '14px',
            fontWeight: 500,
            fontFamily: 'var(--kipu-font-family, Roboto, sans-serif)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flex: fullWidth ? 1 : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
        };

        if (variant === 'underline') {
            return {
                ...baseStyles,
                background: 'transparent',
                color: isActive ? activeColor : inactiveColor,
                borderBottom: isActive ? `2px solid ${activeColor}` : '2px solid transparent',
                marginBottom: '-2px',
            };
        }
        return {
            ...baseStyles,
            background: isActive ? 'white' : 'transparent',
            color: isActive ? activeColor : inactiveColor,
            borderRadius: '6px',
            boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
        };
    };

    return (
        <div style={containerStyles}>
            {tabs.map((tab) => (
                <button
                    type="button"
                    key={tab.value}
                    style={getTabStyles(activeTab === tab.value)}
                    onClick={() => onChange(tab.value)}
                    disabled={tab.disabled}
                >
                    {tab.icon && <span style={{ display: 'flex' }}>{tab.icon}</span>}
                    {tab.label}
                    {tab.badge && (
                        <span
                            style={{
                                background: 'var(--kipu-color-blue-500, #1565C0)',
                                color: 'white',
                                fontSize: '11px',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                marginLeft: '4px',
                            }}
                        >
                            {tab.badge}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

const orderViewTabs = [
    { value: 'active', label: 'Active Orders' },
    { value: 'inactive', label: 'Inactive Orders' },
    { value: 'all', label: 'Show all Orders' },
];

const OrdersViewSystemTabs = () => {
    const [activeTab, setActiveTab] = useState('active');

    return (
        <SystemTabs
            tabs={orderViewTabs}
            activeTab={activeTab}
            variant="underline"
            onChange={(value) => {
                setActiveTab(value);
                document.dispatchEvent(
                    new CustomEvent('ordersViewTabChange', { detail: value, bubbles: true })
                );
            }}
        />
    );
};

const ordersViewTabsRoot = document.getElementById('orders-view-system-tabs-root');
if (ordersViewTabsRoot) {
    const root = ReactDOM.createRoot(ordersViewTabsRoot);
    root.render(<OrdersViewSystemTabs />);
}
