// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BMBLANCE Token
 * @dev ERC20 token with reflection rewards, eco-donation, and auto-liquidity features
 */
contract BMBLANCE is ERC20, Ownable, ReentrancyGuard {
    
    // Tax percentages (basis points, 100 = 1%)
    uint256 public reflectionTax = 200;  // 2%
    uint256 public donationTax = 200;    // 2%
    uint256 public liquidityTax = 200;   // 2%
    uint256 public constant MAX_TAX = 1000; // 10% max total tax
    
    // Wallets
    address public donationWallet;
    address public liquidityWallet;
    
    // Reflection tracking
    mapping(address => uint256) private _reflectionBalance;
    mapping(address => uint256) private _tokenBalance;
    mapping(address => bool) private _isExcludedFromFee;
    mapping(address => bool) private _isExcludedFromReward;
    
    uint256 private constant MAX = ~uint256(0);
    uint256 private _totalSupply;
    uint256 private _reflectionTotal;
    
    // Events
    event TaxesUpdated(uint256 reflectionTax, uint256 donationTax, uint256 liquidityTax);
    event DonationWalletUpdated(address newWallet);
    event LiquidityWalletUpdated(address newWallet);
    event ExcludedFromFee(address account, bool excluded);
    event DonationSent(address to, uint256 amount);
    
    constructor(
        address _donationWallet,
        address _liquidityWallet
    ) ERC20("BMBLANCE", "BMBL") Ownable(msg.sender) {
        require(_donationWallet != address(0), "Invalid donation wallet");
        require(_liquidityWallet != address(0), "Invalid liquidity wallet");
        
        donationWallet = _donationWallet;
        liquidityWallet = _liquidityWallet;
        
        _totalSupply = 1_000_000_000_000 * 10**decimals(); // 1 trillion
        _reflectionTotal = (MAX - (MAX % _totalSupply));
        
        _reflectionBalance[msg.sender] = _reflectionTotal;
        
        // Exclude owner, contract, and special wallets from fees
        _isExcludedFromFee[msg.sender] = true;
        _isExcludedFromFee[address(this)] = true;
        _isExcludedFromFee[donationWallet] = true;
        _isExcludedFromFee[liquidityWallet] = true;
        
        emit Transfer(address(0), msg.sender, _totalSupply);
    }
    
    /**
     * @dev Returns the token balance of an account including reflection rewards
     */
    function balanceOf(address account) public view override returns (uint256) {
        if (_isExcludedFromReward[account]) return _tokenBalance[account];
        return tokenFromReflection(_reflectionBalance[account]);
    }
    
    /**
     * @dev Returns total supply
     */
    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }
    
    /**
     * @dev Convert reflection amount to token amount
     */
    function tokenFromReflection(uint256 reflectionAmount) public view returns (uint256) {
        require(reflectionAmount <= _reflectionTotal, "Amount must be less than total reflections");
        uint256 currentRate = _getRate();
        return reflectionAmount / currentRate;
    }
    
    /**
     * @dev Get current rate for reflection calculation
     */
    function _getRate() private view returns (uint256) {
        return _reflectionTotal / _totalSupply;
    }
    
    /**
     * @dev Transfer tokens with tax mechanism
     */
    function _update(address from, address to, uint256 amount) internal override {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(amount > 0, "Transfer amount must be greater than zero");
        
        // Check if fees should be applied
        bool takeFee = true;
        if (_isExcludedFromFee[from] || _isExcludedFromFee[to]) {
            takeFee = false;
        }
        
        if (takeFee && (reflectionTax + donationTax + liquidityTax) > 0) {
            // Calculate taxes
            uint256 reflectionAmount = (amount * reflectionTax) / 10000;
            uint256 donationAmount = (amount * donationTax) / 10000;
            uint256 liquidityAmount = (amount * liquidityTax) / 10000;
            uint256 transferAmount = amount - reflectionAmount - donationAmount - liquidityAmount;
            
            // Apply reflection to all holders
            if (reflectionAmount > 0) {
                _reflectTokens(reflectionAmount);
            }
            
            // Send to donation wallet
            if (donationAmount > 0) {
                _transferStandard(from, donationWallet, donationAmount);
                emit DonationSent(donationWallet, donationAmount);
            }
            
            // Send to liquidity wallet
            if (liquidityAmount > 0) {
                _transferStandard(from, liquidityWallet, liquidityAmount);
            }
            
            // Transfer remaining to recipient
            _transferStandard(from, to, transferAmount);
        } else {
            _transferStandard(from, to, amount);
        }
    }
    
    /**
     * @dev Standard transfer
     */
    function _transferStandard(address sender, address recipient, uint256 amount) private {
        uint256 currentRate = _getRate();
        uint256 reflectionAmount = amount * currentRate;
        
        _reflectionBalance[sender] -= reflectionAmount;
        _reflectionBalance[recipient] += reflectionAmount;
        
        if (_isExcludedFromReward[sender]) {
            _tokenBalance[sender] -= amount;
        }
        if (_isExcludedFromReward[recipient]) {
            _tokenBalance[recipient] += amount;
        }
        
        emit Transfer(sender, recipient, amount);
    }
    
    /**
     * @dev Reflect tokens to all holders
     */
    function _reflectTokens(uint256 amount) private {
        uint256 currentRate = _getRate();
        uint256 reflectionAmount = amount * currentRate;
        _reflectionTotal -= reflectionAmount;
    }
    
    /**
     * @dev Update tax percentages (owner only)
     */
    function updateTaxes(
        uint256 _reflectionTax,
        uint256 _donationTax,
        uint256 _liquidityTax
    ) external onlyOwner {
        require(_reflectionTax + _donationTax + _liquidityTax <= MAX_TAX, "Total tax too high");
        reflectionTax = _reflectionTax;
        donationTax = _donationTax;
        liquidityTax = _liquidityTax;
        emit TaxesUpdated(_reflectionTax, _donationTax, _liquidityTax);
    }
    
    /**
     * @dev Update donation wallet (owner only)
     */
    function updateDonationWallet(address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Invalid address");
        donationWallet = _newWallet;
        _isExcludedFromFee[_newWallet] = true;
        emit DonationWalletUpdated(_newWallet);
    }
    
    /**
     * @dev Update liquidity wallet (owner only)
     */
    function updateLiquidityWallet(address _newWallet) external onlyOwner {
        require(_newWallet != address(0), "Invalid address");
        liquidityWallet = _newWallet;
        _isExcludedFromFee[_newWallet] = true;
        emit LiquidityWalletUpdated(_newWallet);
    }
    
    /**
     * @dev Exclude or include account from fees
     */
    function setExcludedFromFee(address account, bool excluded) external onlyOwner {
        _isExcludedFromFee[account] = excluded;
        emit ExcludedFromFee(account, excluded);
    }
    
    /**
     * @dev Check if account is excluded from fees
     */
    function isExcludedFromFee(address account) external view returns (bool) {
        return _isExcludedFromFee[account];
    }
    
    /**
     * @dev Burn tokens
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
    
    // ============================================
    // PRESALE FUNCTIONALITY
    // ============================================
    
    uint256 public tokenPrice = 10000000; // 10 million tokens per 1 ETH (adjustable)
    bool public presaleActive = true;
    uint256 public presaleMinPurchase = 0.001 ether; // Minimum 0.001 ETH
    uint256 public presaleMaxPurchase = 10 ether;    // Maximum 10 ETH per transaction
    
    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);
    event PresaleStatusChanged(bool active);
    event TokenPriceUpdated(uint256 newPrice);
    
    /**
     * @dev Buy tokens with ETH - Main presale function
     * Users send ETH, receive BMBL tokens from owner's balance
     */
    function buyTokens() external payable nonReentrant {
        require(presaleActive, "Presale is not active");
        require(msg.value >= presaleMinPurchase, "Below minimum purchase");
        require(msg.value <= presaleMaxPurchase, "Exceeds maximum purchase");
        
        // Calculate token amount based on ETH sent
        uint256 tokenAmount = (msg.value * tokenPrice * 10**decimals()) / 1 ether;
        
        // Check owner has enough tokens
        require(balanceOf(owner()) >= tokenAmount, "Insufficient presale tokens");
        
        // Transfer tokens from owner to buyer
        _transferStandard(owner(), msg.sender, tokenAmount);
        
        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
        emit Transfer(owner(), msg.sender, tokenAmount);
    }
    
    /**
     * @dev Toggle presale on/off (owner only)
     */
    function setPresaleActive(bool _active) external onlyOwner {
        presaleActive = _active;
        emit PresaleStatusChanged(_active);
    }
    
    /**
     * @dev Update token price (owner only)
     * @param _newPrice Number of tokens per 1 ETH
     */
    function setTokenPrice(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, "Price must be greater than 0");
        tokenPrice = _newPrice;
        emit TokenPriceUpdated(_newPrice);
    }
    
    /**
     * @dev Update presale limits (owner only)
     */
    function setPresaleLimits(uint256 _min, uint256 _max) external onlyOwner {
        require(_min < _max, "Min must be less than max");
        presaleMinPurchase = _min;
        presaleMaxPurchase = _max;
    }
    
    /**
     * @dev Get presale info
     */
    function getPresaleInfo() external view returns (
        bool active,
        uint256 price,
        uint256 minPurchase,
        uint256 maxPurchase,
        uint256 availableTokens
    ) {
        return (
            presaleActive,
            tokenPrice,
            presaleMinPurchase,
            presaleMaxPurchase,
            balanceOf(owner())
        );
    }
    
    // ============================================
    // END PRESALE FUNCTIONALITY
    // ============================================
    
    /**
     * @dev Emergency withdraw tokens sent to contract by mistake
     */
    function rescueTokens(address tokenAddress, uint256 amount) external onlyOwner {
        require(tokenAddress != address(this), "Cannot rescue own token");
        IERC20(tokenAddress).transfer(owner(), amount);
    }
    
    /**
     * @dev Receive ETH
     */
    receive() external payable {}
    
    /**
     * @dev Withdraw ETH from contract (owner only)
     * This is how you collect the ETH from presale for charity!
     */
    function withdrawETH() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Check contract ETH balance
     */
    function getContractETHBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
